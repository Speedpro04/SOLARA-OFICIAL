# MEMORY — Solara Connect (Registro de Decisões e Arquitetura)

Este documento registra marcos de arquitetura, configurações de produção e decisões estratégicas do **Solara Connect**.

---

## 1. Migração Stripe (CPF → CNPJ)
- **Status:** ✅ Concluída em Produção
- **Razão Social / CNPJ:** `26.998.571/0001-50`
- **E-mail de Contato Oficial:** `contato@solaraconnect.online`
- **Chaves API:** `pk_live_...` (frontend `.env`) e `sk_live_...` (backend `backend/app/.env`).
- **Webhook ID & Secret:** `we_1U31...` e `whsec_...` ativados no backend.
- **Payment Links:** 4 links ativos em produção (R$ 197, R$ 397, R$ 597 e R$ 897).
- **Segurança:** Todas as chaves secretas estão isoladas no backend e ignoradas no `.gitignore`.

---

## 2. Evolução da Inteligência Artificial (Substituição da IA Monolítica)
- **Status:** ✅ Concluída (Arquitetura Multi-Agente)
- **Modelo:** **OpenAI `gpt-5-mini`** (`reasoning_effort: low`)
- **Arquitetura:** A antiga IA monolítica foi descontinuada. O cérebro da Solara opera agora com **3 Agentes Especialistas + 1 Roteador Inteligente (Router)**:
  1. **Router / Intent Classifier:** Classifica mensagens entre `booking`, `followup`, `handoff` ou `general`.
  2. **Booking Agent (Agente de Agendamento):** Coleta dados e executa a chamada de função `criar_pre_agendamento`.
  3. **Follow-up Agent (Agente de Relacionamento):** Confirmações, lembretes e pós-atendimento afetuoso.
  4. **Handoff Agent (Agente de Transbordo):** Triagem de urgência e transferência limpa para a equipe humana da recepção (pausando o bot).

---

## 3. Integração WhatsApp & Meta API (Próximo Passo Estratégico)
- **Status Atual:** Evolution API (`evoapi.axoshub.com`) em operação temporária.
- **Decisão:** **Abandonar a Evolution API** e realizar a migração definitiva para a **API Oficial da Meta (WhatsApp Cloud API)**.
- **Objetivo:** Maior estabilidade, redução de riscos de bloqueio de número, webhook direto oficial da Meta e selo verificado de empresa.

---

> **Última Atualização:** 10/08/2026
