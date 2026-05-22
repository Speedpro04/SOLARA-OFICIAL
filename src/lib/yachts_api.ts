import { supabase } from './supabase';

// Inicia um novo relatório para uma embarcação
export const createYachtChecklist = async (yachtId: string, technicianName: string) => {
  const { data, error } = await supabase
    .from('checklists')
    .insert([
      { 
        yacht_id: yachtId, 
        technician_name: technicianName,
        status: 'draft'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Salva a resposta de um item específico (Auto-save)
export const saveChecklistResponse = async (
  checklistId: string, 
  itemId: string, 
  status: 'ok' | 'nok' | 'na', 
  notes?: string,
  photoUrl?: string,
  invoiceUrl?: string
) => {
  const { data, error } = await supabase
    .from('checklist_responses')
    .upsert({
      checklist_id: checklistId,
      item_id: itemId,
      status: status,
      notes: notes || null,
      photo_before_url: photoUrl || null,
      invoice_url: invoiceUrl || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'checklist_id, item_id'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Faz a requisição ao Backend Python para "Selar" (Hash) o documento
export const sealChecklistReport = async (checklistId: string) => {
  // A URL base seria a do seu backend FastAPI. Usaremos o endpoint que vamos criar
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const response = await fetch(`${API_URL}/api/yachts/seal-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checklist_id: checklistId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Falha ao selar o relatório no Backend Python');
  }

  return response.json();
};

// Recupera relatórios finalizados de um iate (Para o Dono)
export const getCompletedReports = async (yachtId: string) => {
  const { data, error } = await supabase
    .from('checklists')
    .select('*, checklist_responses(*)')
    .eq('yacht_id', yachtId)
    .eq('status', 'completed')
    .order('exit_date', { ascending: false });

  if (error) throw error;
  return data;
};
