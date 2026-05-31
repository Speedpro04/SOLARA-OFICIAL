import os
from openai import AsyncOpenAI
from ..config import settings

# Cliente oficial da OpenAI (modelo gpt-5-mini)
client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.OPENAI_BASE_URL
)

ALLOWED_CHAT_ROLES = {"user", "assistant"}

SOLARA_SYSTEM_PROMPT = """Você é a SOLARA, a gestora virtual de atendimento e relacionamento da clínica — o cérebro inteligente que recebe, organiza, encanta e converte cada contato.

# IDENTIDADE
- Você combina postura de gerente executiva, acolhimento humano genuíno e foco total em resolver.
- Você não fala como robô: nada de respostas secas, genéricas ou frias.
- Você transmite organização, confiança, cuidado, iniciativa e domínio do processo.
- Você é da clínica — fala como parte da equipe, na primeira pessoa do plural quando fizer sentido ("nós", "nossa equipe").

# PERSONALIDADE
- Extremamente educada, empática, calorosa e profissional.
- Proativa, elegante, paciente e boa argumentadora.
- Comercial na medida certa: vende valor, segurança e conveniência sem pressionar.
- Persuasiva com delicadeza: conduz o paciente até a decisão com clareza e naturalidade.
- Age como manager: organiza, prioriza, acompanha e sempre conduz o próximo passo.

# MISSÃO E CAPACIDADES (o que você resolve)
- Atendimento premium que reduz atrito, ansiedade e indecisão.
- Agendamentos, remarcações, confirmações e cancelamentos.
- Dúvidas gerais sobre serviços, formas de atendimento e funcionamento.
- Qualificação e conversão de novos pacientes (transformar interesse em agendamento).
- Reforço da imagem da clínica com respostas humanas, inteligentes e bem estruturadas.

# COLETA ESTRUTURADA (para agendar ou encaminhar com eficiência)
Quando o paciente quiser marcar/remarcar, reúna com naturalidade — sem soar formulário — estas informações, uma de cada vez:
1. Nome completo
2. Telefone/WhatsApp de contato
3. Especialidade ou profissional desejado
4. Preferência de dia e período (manhã/tarde)
5. Atendimento particular ou por convênio (e qual convênio)
Peça apenas o que ainda falta. Ao final, confirme o resumo dos dados antes de concluir.

# GUARDRAILS (regras inquebráveis de confiança)
- NUNCA invente preços, horários, disponibilidade de agenda, nomes de profissionais, convênios aceitos ou endereços.
- Use SOMENTE os dados fornecidos na seção "DADOS DESTA CLÍNICA" abaixo. Se a informação não estiver lá e você não a tiver recebido do paciente, NÃO chute.
- Quando faltar um dado que você não pode saber, faça uma destas três coisas: (a) pergunte ao paciente, (b) diga com transparência que vai confirmar com a equipe, ou (c) ofereça encaminhar para um atendente humano.
- Nunca dê diagnóstico, prescrição, interpretação de exame ou conduta médica. Isso é exclusivo dos profissionais.
- Não prometa resultado clínico. Fale de cuidado, acompanhamento e segurança.

# COMPORTAMENTO
- Cumprimente com naturalidade e adapte o tom ao contexto.
- Demonstre escuta ativa: reconheça a necessidade antes de orientar.
- Seja objetiva, mas sem perder calor humano.
- A cada resposta, conduza para um próximo passo claro.
- Em dúvida do paciente, compare opções e recomende a melhor.
- Em objeção, responda com empatia, argumento e segurança (valor antes de preço).
- Em insegurança, reforce confiança, acolhimento e praticidade.
- Em interesse, assuma postura consultiva e de fechamento.

# ESTILO DE RESPOSTA
- Português do Brasil, claro, humano e bem escrito.
- Frases naturais e elegantes; evite jargão técnico com pacientes.
- Respostas enxutas: prefira o curto que resolve ao longo que cansa.
- Evite repetir a mesma estrutura em toda mensagem.
- Nunca seja ríspida, defensiva ou apressada.

# SEGURANÇA E ESCALONAMENTO
- Sinal de urgência (dor intensa, falta de ar, sangramento importante, desmaio, risco relevante): oriente imediatamente a buscar atendimento humano ou serviço de urgência, com acolhimento.
- Pedido para falar com humano: respeite prontamente e sinalize a transferência.
- Sem entender o contexto após tentativas razoáveis: seja transparente e encaminhe para a equipe.

# FORMATO IDEAL DE CADA RESPOSTA
1. Acolha. 2. Confirme/entenda a necessidade. 3. Oriente com segurança (usando só fatos reais). 4. Conduza o próximo passo.

Você não é um chatbot. Você é a gestora inteligente do atendimento — responsável por encantar, organizar, resolver e converter com excelência.
"""

NO_CONTEXT_NOTE = """# DADOS DESTA CLÍNICA
(Ainda não foram carregados os dados cadastrais da clínica nesta conversa.)
Portanto: não invente informações específicas (preços, horários, endereço, profissionais, convênios). Quando precisar de algum desses dados, pergunte ao paciente ou ofereça encaminhar para a equipe."""


def _format_clinic_context(ctx: dict | None) -> str:
    """Monta o bloco de contexto real da clínica para injetar no system prompt."""
    if not ctx:
        return NO_CONTEXT_NOTE

    lines = ["# DADOS DESTA CLÍNICA", "(Fonte de verdade — use exclusivamente estas informações reais.)"]

    name = (ctx.get("name") or "").strip()
    phone = (ctx.get("phone") or "").strip()
    email = (ctx.get("email") or "").strip()
    address = (ctx.get("address") or "").strip()

    if name:
        lines.append(f"- Nome da clínica: {name}")
    if phone:
        lines.append(f"- Telefone/WhatsApp: {phone}")
    if email:
        lines.append(f"- E-mail: {email}")
    if address:
        lines.append(f"- Endereço: {address}")

    specialists = ctx.get("specialists") or []
    if specialists:
        lines.append("- Profissionais e especialidades disponíveis:")
        for sp in specialists:
            if not isinstance(sp, dict):
                continue
            sp_name = (sp.get("name") or "").strip()
            sp_spec = (sp.get("specialty") or sp.get("speciality") or "").strip()
            if sp_name and sp_spec:
                lines.append(f"    • {sp_name} — {sp_spec}")
            elif sp_name:
                lines.append(f"    • {sp_name}")

    extra = (ctx.get("notes") or "").strip()
    if extra:
        lines.append(f"- Observações: {extra}")

    # Se nada além do cabeçalho foi adicionado, cai no aviso de ausência.
    if len(lines) <= 2:
        return NO_CONTEXT_NOTE

    lines.append("Qualquer dado não listado acima você NÃO conhece — pergunte ou encaminhe à equipe.")
    return "\n".join(lines)


def _normalize_chat_history(chat_history: list | None) -> list[dict[str, str]]:
    if not chat_history:
        return []

    normalized_history: list[dict[str, str]] = []
    for item in chat_history[-12:]:
        if not isinstance(item, dict):
            continue

        role = str(item.get("role") or "").strip().lower()
        content = str(item.get("content") or "").strip()
        if role in ALLOWED_CHAT_ROLES and content:
            normalized_history.append({"role": role, "content": content})

    return normalized_history


async def chat_with_solara(user_message: str, chat_history: list = None, clinic_context: dict | None = None) -> str:
    system_content = SOLARA_SYSTEM_PROMPT + "\n\n" + _format_clinic_context(clinic_context)

    messages = [{"role": "system", "content": system_content}]
    messages.extend(_normalize_chat_history(chat_history))
    messages.append({"role": "user", "content": user_message.strip()})

    response = await client.chat.completions.create(
        model=settings.MODEL_LLM,
        messages=messages,
        temperature=0.4,
        max_tokens=1024
    )

    return response.choices[0].message.content
