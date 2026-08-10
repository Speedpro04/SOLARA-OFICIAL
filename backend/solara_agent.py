import os
from app.services.ai_service import chat_with_solara as _chat_with_solara

async def chat_with_solara(user_message: str, chat_history: list = None, agent_mode: str = "auto") -> str:
    """Invoca o cérebro unificado da Solara IA com arquitetura multi-agente (GPT-5 Mini)."""
    return await _chat_with_solara(user_message, chat_history, agent_mode=agent_mode)
