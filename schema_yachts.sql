-- ============================================
-- YACHT'S ATLAS — SQL SCHEMA (SUPABASE)
-- ============================================

-- 1. YACHTS (Embarcações)
CREATE TABLE yachts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    registration_number TEXT, -- REB
    owner_id UUID, -- Relacionamento futuro (opcional agora)
    marina_location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHECKLISTS (A Instância do Relatório)
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    yacht_id UUID NOT NULL REFERENCES yachts(id) ON DELETE CASCADE,
    technician_name TEXT NOT NULL,
    technician_signature TEXT, -- Pode ser base64 ou URL de S3
    entry_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exit_date TIMESTAMPTZ,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
    unique_hash TEXT UNIQUE, -- Para auditoria e LGPD (SHA-256)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHECKLIST_CATEGORIES (Ex: "Motor e Propulsão")
CREATE TABLE checklist_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- 4. CHECKLIST_ITEMS (Ex: "Troca de óleo do motor")
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES checklist_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    requires_photo BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0
);

-- 5. CHECKLIST_RESPONSES (O preenchimento do item para um checklist específico)
CREATE TABLE checklist_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'na' CHECK (status IN ('ok', 'nok', 'na')),
    notes TEXT,
    photo_before_url TEXT,
    photo_after_url TEXT,
    invoice_url TEXT, -- Nota fiscal (se aplicável)
    metrics JSONB, -- Ex: { "horimetro": 120, "data_troca": "2024-10-01" }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(checklist_id, item_id) -- Apenas uma resposta por item no mesmo checklist
);

-- ============================================
-- POPULANDO DADOS INICIAIS (SEED)
-- ============================================

-- Categorias
INSERT INTO checklist_categories (id, name, display_order) VALUES
(gen_random_uuid(), 'Documentação Legal e Certificações', 1),
(gen_random_uuid(), 'Motor e Propulsão', 2),
(gen_random_uuid(), 'Elétrica, Eletrônica e Conectividade', 3),
(gen_random_uuid(), 'Segurança e Salvatagem', 4),
(gen_random_uuid(), 'Integridade Estrutural', 5),
(gen_random_uuid(), 'Pintura, Acabamento e Estética', 6),
(gen_random_uuid(), 'Interior e Acomodações', 7),
(gen_random_uuid(), 'Gestão e Governança de Dados', 8);

-- NOTA: Os itens individuais (checklist_items) serão inseridos pela aplicação ou scripts de seed adicionais, 
-- referenciando os IDs das categorias geradas acima.
