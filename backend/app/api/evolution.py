from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
import httpx
from ..config import settings
from ..services.supabase_service import supabase_client
from ..services.ai_service import chat_with_solara
import logging
from typing import Any

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

# Conteúdos que não devem disparar resposta automática da Solara.
_NON_REPLYABLE = {"[audio]", "[mensagem sem texto]"}


def _require_webhook_auth(request: Request) -> None:
    if not settings.EVOLUTION_WEBHOOK_SECRET:
        return

    provided_token = request.query_params.get("token") or request.headers.get("x-webhook-token")
    if provided_token != settings.EVOLUTION_WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Webhook token inválido")


def _extract_instance_name(payload: dict[str, Any]) -> str | None:
    instance_block = payload.get("instance")
    if isinstance(instance_block, dict):
        for key in ("instanceName", "instance_name"):
            value = instance_block.get(key)
            if value:
                return str(value)
    for key in ("instance", "instanceName", "instance_name", "sender"):
        value = payload.get(key)
        if isinstance(value, str) and value:
            return value
    return None


def _extract_event_name(payload: dict[str, Any], event_slug: str | None) -> str:
    event_name = payload.get("event")
    if isinstance(event_name, str) and event_name:
        # A Evolution v2 envia "messages.upsert"; normalizamos para MESSAGES_UPSERT.
        return event_name.upper().replace(".", "_").replace("-", "_")
    if event_slug:
        return event_slug.replace("-", "_").upper()
    return "UNKNOWN"


def _extract_message_payload(payload: dict[str, Any]) -> dict[str, Any] | None:
    data_block = payload.get("data")
    if isinstance(data_block, dict):
        if isinstance(data_block.get("message"), dict):
            return data_block
        if isinstance(data_block.get("key"), dict):
            return data_block

    if isinstance(payload.get("message"), dict):
        return payload
    return None


def _extract_text_content(message_payload: dict[str, Any]) -> str:
    message = message_payload.get("message") or {}
    if not isinstance(message, dict):
        return ""

    for key in ("conversation", "extendedTextMessage", "imageMessage", "videoMessage", "documentMessage"):
        value = message.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
        if isinstance(value, dict):
            text = value.get("text") or value.get("caption")
            if isinstance(text, str) and text.strip():
                return text.strip()

    audio_message = message.get("audioMessage")
    if isinstance(audio_message, dict):
        return "[audio]"

    return "[mensagem sem texto]"


def _extract_remote_jid(message_payload: dict[str, Any]) -> str | None:
    key_block = message_payload.get("key")
    if isinstance(key_block, dict):
        remote_jid = key_block.get("remoteJid")
        if isinstance(remote_jid, str) and remote_jid:
            return remote_jid
    return None


def _is_group(remote_jid: str | None) -> bool:
    """Mensagens de grupo têm o sufixo @g.us — a Solara não responde grupos."""
    return bool(remote_jid and "@g.us" in remote_jid)


def _normalize_phone(remote_jid: str | None) -> str | None:
    if not remote_jid:
        return None
    phone = remote_jid.split("@")[0].strip()
    if not phone:
        return None
    if ":" in phone:
        phone = phone.split(":")[0]
    return "".join(ch for ch in phone if ch.isdigit()) or None


def _is_from_me(message_payload: dict[str, Any]) -> bool:
    key_block = message_payload.get("key")
    if isinstance(key_block, dict):
        return bool(key_block.get("fromMe"))
    return False


def _find_clinic_id_by_instance(instance_name: str | None) -> str | None:
    if not instance_name:
        return None

    try:
        result = supabase_client.table("clinics").select("id").eq("whatsapp_instance_id", instance_name).limit(1).execute()
        if result.data:
            return result.data[0]["id"]
    except Exception:
        logging.info("Tabela clinics sem whatsapp_instance_id ou consulta indisponível; tentando fallback por prefixo.")

    if instance_name.startswith("solara_"):
        clinic_prefix = instance_name.removeprefix("solara_")
        try:
            result = supabase_client.table("clinics").select("id").ilike("id", f"{clinic_prefix}%").limit(1).execute()
            if result.data:
                return result.data[0]["id"]
        except Exception:
            logging.info("Fallback por prefixo de clinic_id não disponível para a instância %s.", instance_name)

    return None


def _find_clinic_id_by_phone(phone: str | None) -> str | None:
    """Cenário multi-clínica (número único): descobre a clínica pelo telefone do paciente."""
    if not phone:
        return None
    try:
        result = (
            supabase_client.table("patients")
            .select("clinic_id")
            .or_(f"phone.eq.{phone},phone.like.%{phone}%")
            .limit(1)
            .execute()
        )
        if result.data and result.data[0].get("clinic_id"):
            return result.data[0]["clinic_id"]
    except Exception as exc:
        logging.warning("Falha ao identificar clínica pelo telefone %s: %s", phone, exc)
    return None


def _find_patient_id(clinic_id: str | None, phone: str | None) -> str | None:
    if not phone:
        return None

    try:
        query = supabase_client.table("patients").select("id")
        if clinic_id:
            query = query.eq("clinic_id", clinic_id)

        result = query.or_(f"phone.eq.{phone},phone.like.%{phone}%").limit(1).execute()
        if result.data:
            return result.data[0]["id"]
    except Exception as exc:
        logging.warning("Não foi possível localizar paciente pelo telefone %s: %s", phone, exc)

    return None


def _fetch_conversation_history(patient_id: str | None, exclude_content: str, limit: int = 10) -> list[dict[str, str]]:
    """Histórico recente da conversa (para dar memória à Solara), em ordem cronológica."""
    if not patient_id:
        return []
    try:
        result = (
            supabase_client.table("messages")
            .select("content, sender_type, created_at")
            .eq("patient_id", patient_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        rows = list(reversed(result.data or []))
        history: list[dict[str, str]] = []
        for row in rows:
            content = (row.get("content") or "").strip()
            if not content or content in _NON_REPLYABLE:
                continue
            role = "user" if row.get("sender_type") == "patient" else "assistant"
            history.append({"role": role, "content": content})

        # Remove a própria mensagem atual (já persistida) do fim do histórico, se presente.
        if history and history[-1]["role"] == "user" and history[-1]["content"] == exclude_content:
            history.pop()
        return history
    except Exception as exc:
        logging.warning("Falha ao buscar histórico da conversa: %s", exc)
        return []


def _persist_message(clinic_id: str | None, patient_id: str | None, content: str, sender_type: str, raw_payload: dict[str, Any]) -> None:
    try:
        payload: dict[str, Any] = {
            "content": content,
            "sender_type": sender_type,
            "status": "received" if sender_type == "patient" else "sent",
            "metadata": raw_payload,
        }
        if clinic_id:
            payload["clinic_id"] = clinic_id
        if patient_id:
            payload["patient_id"] = patient_id

        supabase_client.table("messages").insert(payload).execute()
    except Exception as exc:
        logging.warning("Webhook recebido, mas falhou ao persistir mensagem no Supabase: %s", exc)


async def _send_whatsapp_reply(instance_name: str | None, phone: str | None, text: str) -> bool:
    """Envia a resposta da Solara de volta pelo WhatsApp via Evolution API."""
    if not (instance_name and phone and text and settings.EVOLUTION_API_KEY):
        return False
    url = f"{settings.EVOLUTION_API_URL}/message/sendText/{instance_name}"
    headers = {"apikey": settings.EVOLUTION_API_KEY, "Content-Type": "application/json"}
    payload = {"number": phone, "text": text}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code >= 400:
                logging.warning("Falha ao enviar resposta WhatsApp para %s: %s", phone, response.text)
                return False
            return True
    except Exception as exc:
        logging.warning("Erro ao enviar resposta WhatsApp para %s: %s", phone, exc)
        return False


async def _process_solara_reply(instance_name: str | None, phone: str | None, clinic_id: str | None, patient_id: str | None, content: str) -> None:
    """Gera a resposta da Solara e devolve pelo WhatsApp (executado em background)."""
    try:
        from .ai import _load_clinic_context  # import tardio evita ciclo de importação
        clinic_context = _load_clinic_context(clinic_id) if clinic_id else None
        history = _fetch_conversation_history(patient_id, content)
        reply = await chat_with_solara(content, history, clinic_context)
        if not reply or not reply.strip():
            return
        reply = reply.strip()
        # Registra a resposta da Solara como mensagem enviada
        _persist_message(clinic_id, patient_id, reply, "clinic", {"source": "solara_ai"})
        await _send_whatsapp_reply(instance_name, phone, reply)
    except Exception as exc:
        logging.exception("Falha ao gerar/enviar resposta da Solara: %s", exc)


async def _handle_evolution_webhook(request: Request, background_tasks: BackgroundTasks | None = None, event_slug: str | None = None):
    try:
        _require_webhook_auth(request)
        data = await request.json()
        event_name = _extract_event_name(data, event_slug)
        instance_name = _extract_instance_name(data)

        logging.info("Webhook Evolution recebido: event=%s instance=%s", event_name, instance_name)

        message_payload = _extract_message_payload(data)
        if event_name != "MESSAGES_UPSERT" or not message_payload:
            return {"status": "ignored", "event": event_name, "instance": instance_name}

        sender_type = "clinic" if _is_from_me(message_payload) else "patient"

        remote_jid = _extract_remote_jid(message_payload)
        phone = _normalize_phone(remote_jid)
        clinic_id = _find_clinic_id_by_instance(instance_name)
        patient_id = _find_patient_id(clinic_id, phone)
        content = _extract_text_content(message_payload)

        _persist_message(clinic_id, patient_id, content, sender_type, data)

        # ---- Resposta automática da Solara ----
        # Só para mensagens de TEXTO, de PACIENTES, fora de grupos.
        should_reply = (
            sender_type == "patient"
            and background_tasks is not None
            and content
            and content not in _NON_REPLYABLE
            and not _is_group(remote_jid)
        )
        if should_reply:
            # Número único multi-clínica: se não achou pela instância, identifica pelo telefone.
            effective_clinic_id = clinic_id or _find_clinic_id_by_phone(phone)
            background_tasks.add_task(
                _process_solara_reply, instance_name, phone, effective_clinic_id, patient_id, content
            )

        return {
            "status": "success",
            "event": event_name,
            "instance": instance_name,
            "clinic_id": clinic_id,
            "patient_id": patient_id,
            "auto_reply": bool(should_reply),
        }
    except HTTPException:
        raise
    except Exception as exc:
        logging.exception("Erro ao processar webhook da Evolution API")
        raise HTTPException(status_code=500, detail=f"Erro ao processar webhook: {exc}")


@router.post("/evolution")
async def evolution_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Recebe eventos da Evolution API em um endpoint único.
    """
    return await _handle_evolution_webhook(request, background_tasks)


@router.post("/evolution/{event_slug}")
async def evolution_webhook_by_event(event_slug: str, request: Request, background_tasks: BackgroundTasks):
    """
    Recebe eventos da Evolution API quando webhook por evento estiver habilitado.
    """
    return await _handle_evolution_webhook(request, background_tasks, event_slug)
