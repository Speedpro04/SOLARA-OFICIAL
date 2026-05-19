-- ============================================================
-- CRIAR BUCKET PÚBLICO DE STORAGE - SOLARA CONNECT
-- Execute este script no SQL Editor do Supabase Dashboard:
-- https://supabase.com/dashboard/project/mvqkelauwscxdwnzevtz/sql/new
-- ============================================================

-- 1. Criar o bucket público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public',
  'public',
  true,
  52428800, -- 50MB limite por arquivo
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy: Qualquer pessoa pode VER arquivos públicos
CREATE POLICY "Acesso público para leitura" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public');

-- 3. Policy: Usuários autenticados podem fazer UPLOAD
CREATE POLICY "Upload para usuários autenticados" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'public'
    AND auth.role() = 'authenticated'
  );

-- 4. Policy: Usuários autenticados podem ATUALIZAR seus próprios arquivos
CREATE POLICY "Update próprio para autenticados" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'public'
    AND auth.uid() = owner
  );

-- 5. Policy: Usuários autenticados podem DELETAR seus próprios arquivos
CREATE POLICY "Delete próprio para autenticados" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'public'
    AND auth.uid() = owner
  );

-- ============================================================
-- VERIFICAÇÃO: Rodar após executar o script acima
-- ============================================================
-- SELECT * FROM storage.buckets WHERE id = 'public';
-- SELECT * FROM storage.policies WHERE bucket_id = 'public';
