from fastapi import FastAPI
from dotenv import load_dotenv
import os
from supabase import create_client, Client
from pydantic import BaseModel

import hashlib
import json
from datetime import datetime

from solara_agent import chat_with_solara

load_dotenv()

app = FastAPI(title="Solara Medical High-Tech API", version="1.0.0")

# Inicialização Supabase
SUPABASE_URL: str = os.environ.get("SUPABASE_URL")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class ChatRequest(BaseModel):
    message: str
    phone: str

class SealReportRequest(BaseModel):
    checklist_id: str

@app.get("/")
def read_root():
    return {"status": "Solara Brain Online", "tech": "FastAPI + Polars + Celery"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Futuro: Aqui integraremos o Polars para buscar de forma ultra rápida 
    # o histórico do paciente no Supabase antes de enviar para a IA
    
    response_text = await chat_with_solara(request.message)
    
    # Futuro: Aqui acionaremos o Celery para enfileirar o disparo da mensagem 
    # via Evolution API para o WhatsApp do paciente, garantindo zero travamento no servidor
    
    return {
        "status": "success",
        "solara_response": response_text
    }

# ==========================================
# YACHT'S ATLAS - ROTAS NÍVEL DIAMANTE
# ==========================================
@app.post("/api/yachts/seal-report")
async def seal_yacht_report(request: SealReportRequest):
    """
    Recupera as respostas de um checklist finalizado, 
    gera o Hash Imutável (SHA-256) e sela no banco.
    """
    try:
        # 1. Buscar dados essenciais da embarcação e respostas do checklist
        res_checklist = supabase.table("checklists").select("*").eq("id", request.checklist_id).single().execute()
        if not res_checklist.data:
            return {"error": "Checklist não encontrado"}, 404
            
        checklist_data = res_checklist.data
        
        # Se já estiver completado, retornar o hash existente
        if checklist_data.get("status") == "completed" and checklist_data.get("unique_hash"):
            return {
                "status": "already_sealed",
                "hash": checklist_data["unique_hash"]
            }

        res_responses = supabase.table("checklist_responses").select("*").eq("checklist_id", request.checklist_id).execute()
        responses_data = res_responses.data or []

        # 2. Criar o "Documento Digital" concatenando tudo
        # Para que o hash seja matematicamente verificável, garantimos uma ordem determinística
        responses_sorted = sorted(responses_data, key=lambda x: x['item_id'])
        
        payload_dict = {
            "checklist_id": checklist_data["id"],
            "yacht_id": checklist_data["yacht_id"],
            "technician": checklist_data["technician_name"],
            "entry_date": checklist_data["entry_date"],
            "responses": responses_sorted
        }
        
        # Converte para String JSON ordenada
        payload_str = json.dumps(payload_dict, sort_keys=True)
        
        # 3. Gerar Hash SHA-256
        hash_object = hashlib.sha256(payload_str.encode('utf-8'))
        unique_hash = hash_object.hexdigest()
        
        # 4. Gravar no Supabase (WORM / Status Completed)
        exit_date = datetime.utcnow().isoformat()
        update_res = supabase.table("checklists").update({
            "status": "completed",
            "unique_hash": unique_hash,
            "exit_date": exit_date
        }).eq("id", request.checklist_id).execute()
        
        return {
            "status": "success",
            "message": "Dossiê digital selado com sucesso.",
            "hash": unique_hash,
            "exit_date": exit_date
        }
        
    except Exception as e:
        return {"error": str(e)}, 500
