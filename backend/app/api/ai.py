from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client
from ..services.ai_service import chat_with_solara
from ..config import settings

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Cliente admin (service role) para ler os dados reais da clínica e injetar no cérebro da Solara.
_supabase_admin = None
if settings.SUPABASE_URL and (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY):
    try:
        _supabase_admin = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
        )
    except Exception:
        _supabase_admin = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    phone: str = None  # Telefone opcional para contexto futuro
    clinic_id: str = None  # Opcional: permite carregar os dados reais da clínica
    chat_history: list[ChatMessage] | None = None


def _load_clinic_context(clinic_id: str | None) -> dict | None:
    """Busca, de forma defensiva, os dados reais da clínica para o contexto da Solara."""
    if not clinic_id or not _supabase_admin:
        return None
    try:
        clinic_res = _supabase_admin.table("clinics").select(
            "name, phone, email, address"
        ).eq("id", clinic_id).limit(1).execute()
        if not clinic_res.data:
            return None
        ctx = dict(clinic_res.data[0])

        try:
            sp_res = _supabase_admin.table("specialists").select(
                "name, specialty"
            ).eq("clinic_id", clinic_id).limit(50).execute()
            ctx["specialists"] = sp_res.data or []
        except Exception:
            ctx["specialists"] = []

        return ctx
    except Exception:
        # Nunca derruba o atendimento por causa do contexto — a Solara opera com guardrails.
        return None


@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint para interagir com a Solara IA (gestora de atendimento).
    """
    try:
        history = [message.model_dump() for message in request.chat_history] if request.chat_history else None
        clinic_context = _load_clinic_context(request.clinic_id)
        response_text = await chat_with_solara(request.message, history, clinic_context)
        return {
            "status": "success",
            "solara_response": response_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na IA: {str(e)}")
