import argparse
import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.app.services.ai_service import chat_with_solara


SCENARIOS = [
    {
        "title": "Agendamento",
        "history": [],
        "message": "Quero marcar uma consulta para amanhã, se ainda tiver horário."
    },
    {
        "title": "Objeção de preço",
        "history": [],
        "message": "Achei o valor alto. Vocês conseguem me explicar melhor se vale a pena?"
    },
    {
        "title": "Indecisão",
        "history": [],
        "message": "Ainda não sei se agendo agora ou se espero mais um pouco."
    },
    {
        "title": "Gestão operacional com contexto",
        "history": [
            {
                "role": "user",
                "content": "A agenda de amanhã está bagunçada e a recepção está sobrecarregada."
            },
            {
                "role": "assistant",
                "content": "Posso te ajudar a organizar isso. O principal gargalo está em atrasos, confirmações ou encaixes?"
            }
        ],
        "message": "O maior problema é a falta de confirmação dos pacientes."
    },
    {
        "title": "Urgência",
        "history": [],
        "message": "Estou com dor forte no peito e falta de ar."
    }
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Executa cenarios de teste da Solara AI.")
    parser.add_argument("--limit", type=int, default=len(SCENARIOS), help="Quantidade de cenarios para executar.")
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    for scenario in SCENARIOS[: max(1, args.limit)]:
        print(f"\n=== {scenario['title']} ===")
        response = await chat_with_solara(
            scenario["message"],
            scenario["history"],
        )
        print(f"Usuario: {scenario['message']}")
        print(f"Solara: {response}\n")


if __name__ == "__main__":
    asyncio.run(main())
