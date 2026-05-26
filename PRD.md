# PRD — Solara Medical Connect
### Product Requirements Document
**Versão:** 1.0  
**Data:** 02/05/2026  
**Autor:** Axos Hub  
**E-mail operacional:** axoshub.solara@gmail.com

---

## 1. Visão Geral do Produto

O **Solara Medical Connect** é uma plataforma SaaS de gestão de recepção digital voltada para **clínicas médicas, consultórios e hospitais**. O sistema automatiza o fluxo de atendimento desde a chegada do paciente até a conclusão da consulta, eliminando filas, otimizando agendas e oferecendo uma experiência premium ao corpo clínico e aos pacientes.

### 1.1 Proposta de Valor
- **Para clínicas:** Redução de tempo de espera, gestão visual (Kanban) de atendimentos, agendamento inteligente
- **Para médicos:** Prontuário unificado disponível antes da consulta, controle total de salas
- **Para pacientes:** Experiência sem filas, comunicação via WhatsApp, transparência total

### 1.2 Público-Alvo
| Segmento | Perfil |
|----------|--------|
| Primário | Clínicas médicas de 2 a 20 especialistas |
| Secundário | Consultórios individuais em expansão |
| Terciário | Redes hospitalares e franquias de saúde |

---

## 2. Arquitetura Técnica

### 2.1 Stack de Tecnologia
| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Animações** | Framer Motion |
| **Ícones** | Lucide React |
| **Estilização** | CSS Vanilla (Design System próprio) |
| **Autenticação** | Supabase Auth (JWT) |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **Pagamentos** | Stripe (Checkout + Webhooks) |
| **E-mail** | SMTP Gmail (axoshub.solara@gmail.com) |
| **Hospedagem** | Vercel / Netlify (Frontend) + Supabase (Backend) |

### 2.2 Credenciais do Projeto
| Serviço | Referência |
|---------|-----------|
| Supabase URL | `https://mvqkelauwscxdwnzevtz.supabase.co` |
| Supabase Project ID | `mvqkelauwscxdwnzevtz` |
| Stripe Account | Modo Test |
| E-mail Remetente | `axoshub.solara@gmail.com` |

### 2.3 Estrutura de Arquivos
```
src/
├── lib/
│   ├── supabase.ts          # Cliente Supabase (singleton)
│   └── auth.ts              # Serviço de autenticação completo
├── App.tsx                   # Router principal (state-based)
├── LandingPage.tsx           # Página de vendas (1140px container)
├── LoginPage.tsx             # Login (split-screen dark)
├── RegisterPage.tsx          # Cadastro de clínica
├── CheckoutPage.tsx          # Pagamento + ativação
├── Dashboard.tsx             # Painel de gestão
├── Logo.tsx                  # Componente de logo reutilizável
├── index.css                 # Design System global
└── main.tsx                  # Entry point
schema.sql                    # Schema completo do banco
.env                          # Variáveis de ambiente
```

---

## 3. Design System

### 3.1 Paleta de Cores
| Nome | Hex | Uso |
|------|-----|-----|
| **Primary** | `#130f40` | Sidebar, textos principais, fundos escuros |
| **Background** | `#ffffff` | Fundo geral da LP e Dashboard |
| **Card Background** | `#f7f1e3` | Cards, seções alternadas |
| **Card Border** | `#7ed6df` | Bordas de cards, destaques ciano |
| **Success / CTA** | `#33d9b2` | Botões primários, status ativo |
| **Danger** | `#ff5252` | Alertas, botão sair, erros |
| **Warning** | `#ffda79` | Destaques, badge "Mais Escolhido" |
| **Extra** | `#ff793f` | Cor auxiliar para variações |

### 3.2 Tipografia
- **Família:** Outfit (Google Fonts)
- **Pesos:** 400 (body), 500 (labels), 600 (subtítulos), 700 (botões), 800 (títulos)

### 3.3 Padrão Visual das Páginas Auth
- Layout **split-screen** (35% formulário / 65% visual)
- Fundo escuro: `#0a0822` (esquerda) + `#130f40` (direita)
- Inputs com borda ciano ao receber foco
- Ícone grande com efeito glassmorphism no painel direito
- Logo Solara Medical centralizada acima do formulário

---

## 4. Modelo de Negócio — Planos

### 4.1 Tabela de Preços
| Plano | Especialistas | Preço/mês | Slug |
|-------|--------------|-----------|------|
| **Básico** | Até 2 | R$ 197,00 | `basico` |
| **Crescimento** | 3 a 5 | R$ 397,00 | `crescimento` |
| **Avançado** ⭐ | 6 a 9 | R$ 597,00 | `avancado` |
| **Enterprise** | 10+ | R$ 897,00 | `enterprise` |

> O plano **Avançado** é destacado como "Mais Escolhido" na Landing Page.

### 4.2 Features por Plano
| Feature | Básico | Crescimento | Avançado | Enterprise |
|---------|--------|-------------|----------|------------|
| Gestão de Salas | ✅ | ✅ | ✅ | ✅ |
| Prontuário Integrado | ✅ | ✅ | ✅ | ✅ |
| Suporte por e-mail | ✅ | ✅ | ✅ | ✅ |
| Relatórios básicos | ✅ | ✅ | ✅ | ✅ |
| Agendamento online | ❌ | ✅ | ✅ | ✅ |
| WhatsApp integrado | ❌ | ✅ | ✅ | ✅ |
| Suporte prioritário | ❌ | ✅ | ✅ | ✅ |
| Gestão financeira | ❌ | ❌ | ✅ | ✅ |
| NPS automático | ❌ | ❌ | ✅ | ✅ |
| Automações de fluxo | ❌ | ❌ | ✅ | ✅ |
| Suporte 24/7 | ❌ | ❌ | ✅ | ✅ |
| API dedicada | ❌ | ❌ | ❌ | ✅ |
| Gerente de conta | ❌ | ❌ | ❌ | ✅ |
| SLA garantido | ❌ | ❌ | ❌ | ✅ |
| Personalização | ❌ | ❌ | ❌ | ✅ |
| Treinamento presencial | ❌ | ❌ | ❌ | ✅ |

---

## 5. Schema do Banco de Dados

### 5.1 Tabelas
| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `plans` | Planos de assinatura (4 registros) | SELECT público, write owner |
| `clinics` | Clínicas cadastradas | Isolamento por `owner_auth_id` |
| `users` | Staff da clínica (médicos, recepcionistas) | Isolamento por `clinic_id` |
| `patients` | Pacientes da clínica | Isolamento por `clinic_id` |
| `appointments` | Agendamentos e consultas | Isolamento por `clinic_id` |
| `subscriptions` | Assinaturas Stripe | Acesso por owner |
| `onboarding_tokens` | Tokens de senha provisória | Acesso por e-mail |
| `email_logs` | Registro de e-mails enviados | Acesso por owner |
| `solara_partners_clicks` | Cliques manuais e leads de parceiros B2B | Inserção livre, leitura pública |

### 5.2 Relações
- `plans` → `clinics` (1:N) — cada clínica tem um plano
- `clinics` → `users` (1:N) — cada clínica tem vários membros
- `clinics` → `patients` (1:N) — cada clínica tem seus pacientes
- `clinics` → `appointments` (1:N) — agendamentos por clínica
- `clinics` → `subscriptions` (1:N) — histórico de assinaturas
- `users` → `appointments` (1:N) — médico responsável
- `patients` → `appointments` (1:N) — paciente do agendamento

---

## 6. Fluxos do Usuário

### 6.1 Onboarding (Novo Cliente)
1. Landing Page → Escolhe Plano → Clica "Assinar Agora"
2. Página de Cadastro → Nome da clínica, e-mail, senha
3. Sistema cria: auth.user, clinic, user (owner), subscription (pending), onboarding_token
4. Redireciona para Checkout com plano selecionado
5. Checkout → Preenche cartão → "Finalizar Pagamento"
6. Ativa subscription (status=active), registra email_log
7. Exibe tela de sucesso com dados do e-mail
8. Redireciona para Dashboard automaticamente

### 6.2 Login (Cliente Existente)
1. Landing Page → "Acesso Restrito" → Tela de Login
2. E-mail + Senha → signInWithPassword
3. Busca perfil completo (user + clinic + plan)
4. Redireciona para Dashboard

### 6.3 Logout
1. Dashboard → Botão "Sair"
2. supabase.auth.signOut()
3. Limpa estado → Volta para Landing Page

---

## 7. Segurança

### 7.1 Row Level Security (RLS)
- Todas as tabelas têm RLS habilitado
- Isolamento por tenant (clinic_id)
- Plans: Leitura pública (LP precisa exibir preços)

### 7.2 Autenticação
- Método: E-mail + Senha (Supabase Auth)
- JWT: Auto-refresh habilitado
- Sessão: Persistida no localStorage
- Senha provisória: 12 chars alfanumérico + especiais

### 7.3 Conformidade
- **LGPD:** Dados isolados por clínica, retenção configurável
- **HIPAA-ready:** Criptografia em trânsito e em repouso

---

## 8. Integrações

### 8.1 Stripe (Pagamentos)
- Modo: Test (sandbox)
- Checkout simulado na v1.0
- Webhook configurado para produção

### 8.2 E-mail (SMTP Gmail)
- Remetente: axoshub.solara@gmail.com
- Templates: welcome, payment_confirmed, password_reset
- Logs registrados na tabela email_logs

### 8.3 WhatsApp (Evolution API) — v2.0
- Provider: Evolution API
- Base URL: https://evoapi.axoshub.com

### 8.4 Marketplace de Parceiros (Monetização)
- **Função:** Catálogo completo de 94 parceiros comerciais, organizados por 13 categorias geográficas e de especialidade.
- **Rastreio de Cliques:** Lógica assíncrona não-bloqueante (`trackPartnerClick`) para registrar cliques manuais dos usuários em canais de contato (site/WhatsApp).
- **Isolamento Completo:** A ativação do rastreio e consultas ao Supabase ocorre unicamente quando a página de Parceiros é exibida.
- **Analytics Integrado:** Dashboard real baseado na consolidação dos logs de cliques da tabela `solara_partners_clicks` em tempo real.

---

## 9. Roadmap

### v1.0 — MVP (Atual)
- [x] Landing Page premium com seção de preços
- [x] Tela de Login (dark split-screen)
- [x] Tela de Cadastro integrada com Supabase Auth
- [x] Tela de Checkout com ativação de subscription
- [x] Dashboard de recepção digital
- [x] Schema SQL completo com RLS
- [x] Logo e Design System padronizados
- [x] PRD documentado
- [x] Portal de Parceiros B2B Monetizado com Rastreio de Cliques e Analytics (Supabase)

### v1.1 — Pagamentos Reais
- [ ] Stripe Elements no Checkout
- [ ] Webhook para confirmação automática
- [ ] Gerenciamento de assinatura
- [ ] Upgrade/downgrade de plano

### v1.2 — E-mails Reais
- [ ] Edge Function para envio SMTP
- [ ] Templates HTML de e-mail
- [ ] Fila de envio com retry

### v2.0 — Operação Completa
- [ ] Kanban funcional (drag-and-drop)
- [ ] Agendamentos com calendário visual
- [ ] Prontuário eletrônico
- [ ] Integração WhatsApp
- [ ] NPS automático pós-consulta
- [ ] Relatórios com gráficos
- [ ] Multi-tenant completo

---

## 10. Métricas de Sucesso
| Métrica | Meta |
|---------|------|
| Tempo de cadastro até dashboard | < 3 minutos |
| Taxa de conversão LP → Cadastro | > 5% |
| Uptime do sistema | > 99.5% |
| NPS dos médicos | > 70 |
| Churn mensal | < 5% |

---

> **Documento confidencial.** Propriedade intelectual da Axos Hub.  
> Última atualização: 02/05/2026
