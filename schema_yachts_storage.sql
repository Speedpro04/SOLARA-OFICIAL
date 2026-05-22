-- ============================================
-- YACHT'S ATLAS — STORAGE SCHEMA (SUPABASE)
-- DIAMOND LEVEL SECURITY (WORM CONCEPTS)
-- ============================================

-- 1. Criar o Bucket Privado 'yachts_vault'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'yachts_vault',
    'yachts_vault',
    false, -- BUCKET PRIVADO (Acesso apenas via URLs assinadas ou Auth)
    20971520, -- Limite de 20MB por arquivo
    ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Habilitar RLS no Bucket
-- Isso é gerenciado automaticamente pelo Supabase nas policies de storage.objects

-- 3. Política de Inserção (Apenas Técnicos/Usuários Autenticados podem fazer upload)
CREATE POLICY "Marinas podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'yachts_vault' );

-- 4. Política de Leitura (Apenas Autenticados podem baixar os arquivos do vault)
CREATE POLICY "Autenticados podem visualizar arquivos"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'yachts_vault' );

-- 5. Imutabilidade: PROIBIR DELETAR E ATUALIZAR para garantir WORM (Write Once, Read Many)
-- Removemos as policies de UPDATE e DELETE deliberadamente para "yachts_vault"

-- Para forçar a imutabilidade, garantimos que ninguém pode atualizar ou deletar:
DROP POLICY IF EXISTS "Autenticados podem atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Autenticados podem deletar" ON storage.objects;

-- FIM.
