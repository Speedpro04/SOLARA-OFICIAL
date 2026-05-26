import re
import json

# Ler o arquivo PartnersPage.tsx
with open(r'c:\SOLARA-CONNECT-OFICIAL\src\PartnersPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar a declaração const partnersData: Category[] = [ ... ];
# Vamos fazer um parser baseado em Regex ou simples busca de blocos.
# Como o conteúdo está bem estruturado com { id: '...', name: '...', specialty: '...', site: '...', region: '...', location: '...' }
# podemos capturar todos esses objetos.

# Regex para pegar os blocos de categorias
category_blocks = re.findall(r'id:\s*\'([^\']+)\',\s*title:\s*\'([^\']+)\',\s*icon:\s*\'([^\']+)\',\s*partners:\s*\[(.*?)\]\s*\}', content, re.DOTALL)

sql_inserts = []

for cat_id, cat_title, cat_icon, partners_list_str in category_blocks:
    # Encontrar todos os parceiros individuais na lista
    # Exemplo: { id: 'eo-1', name: 'Gnatus', specialty: 'Líder nacional em consultórios, scanners 3D e periféricos de alta performance.', site: 'gnatus.com.br', region: 'nacional', location: 'Ribeirão Preto / BR' }
    partner_matches = re.findall(r'\{\s*id:\s*\'([^\']+)\',\s*name:\s*\'([^\']+)\',\s*specialty:\s*\'([^\']+)\',\s*site:\s*\'([^\']+)\',\s*region:\s*\'([^\']+)\',\s*location:\s*\'([^\']+)\'\s*\}', partners_list_str)
    
    for pid, name, specialty, site, region, location in partner_matches:
        # Escapar aspas simples para SQL
        name_esc = name.replace("'", "''")
        specialty_esc = specialty.replace("'", "''")
        site_esc = site.replace("'", "''")
        location_esc = location.replace("'", "''")
        
        sql_inserts.append(
            f"('{pid}', '{name_esc}', '{specialty_esc}', '{site_esc}', '{region}', '{location_esc}', '{cat_id}')"
        )

# Escrever a query SQL de insert
print(f"Total de parceiros extraídos: {len(sql_inserts)}")

sql_content = """-- ==========================================================
-- SCRIPT SQL: ESTRUTURA E CARGA DE PARCEIROS SOLARA
-- ==========================================================
-- Execute este script no SQL Editor do painel do seu Supabase.

-- 1. Tabela de Cadastro dos Parceiros
CREATE TABLE IF NOT EXISTS public.solara_partners (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty TEXT NOT NULL,
    site VARCHAR(255) NOT NULL,
    region VARCHAR(20) NOT NULL CHECK (region IN ('nacional', 'vale')),
    location VARCHAR(100) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Tabela de Cliques de Parceiros (Monetização)
CREATE TABLE IF NOT EXISTS public.solara_partners_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    partner_name VARCHAR(100) NOT NULL,
    category_title VARCHAR(100) NOT NULL,
    click_type VARCHAR(20) NOT NULL CHECK (click_type IN ('website', 'whatsapp')),
    clinic_id UUID,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Habilitar RLS em ambas
ALTER TABLE public.solara_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solara_partners_clicks ENABLE ROW LEVEL SECURITY;

-- Políticas para solara_partners (Leitura livre para carregar a página)
CREATE POLICY "Permitir leitura pública de parceiros" 
ON public.solara_partners FOR SELECT USING (true);

-- Políticas para solara_partners_clicks
CREATE POLICY "Permitir inserções públicas de cliques" 
ON public.solara_partners_clicks FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura geral de cliques" 
ON public.solara_partners_clicks FOR SELECT USING (true);

-- Carga inicial de todos os 94 parceiros comerciais homologados
INSERT INTO public.solara_partners (id, name, specialty, site, region, location, category_id)
VALUES
"""

sql_content += ",\n".join(sql_inserts) + ";\n"

# Salvar o arquivo SQL final
with open(r'c:\SOLARA-CONNECT-OFICIAL\supabase_schema_partners.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print("SQL gerado com sucesso!")
