import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tratar preflight request de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obter o formData da requisição (espera o arquivo 'file' e o 'checklistId')
    const formData = await req.formData()
    const file = formData.get('file') as File
    const checklistId = formData.get('checklistId') as string

    if (!file || !checklistId) {
      return new Response(
        JSON.stringify({ error: 'Arquivo e checklistId são obrigatórios' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Gerar Hash SHA-256 do arquivo (Simulação no Deno)
    // No mundo real, usaríamos a Crypto API do Deno para hashear o ArrayBuffer
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Criar um nome único e seguro para o arquivo
    const extension = file.name.split('.').pop()
    const filePath = `${checklistId}/${hashHex}.${extension}`

    // Upload usando a chave de Service Role (Bypass RLS para o servidor confiável)
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('yachts_vault')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false // Nunca sobrescrever (WORM)
      })

    if (uploadError) throw uploadError

    // Retornar os dados
    return new Response(
      JSON.stringify({ 
        message: 'Upload concluído com sucesso e cimentado.',
        filePath: filePath,
        hash: hashHex
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
