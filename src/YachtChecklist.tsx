import React, { useState, useRef, useEffect } from 'react';
import { Camera, FileText, CheckCircle, XCircle, MinusCircle, Shield, UploadCloud } from 'lucide-react';
import { supabase } from './lib/supabase';
import { createYachtChecklist, saveChecklistResponse, sealChecklistReport } from './lib/yachts_api';
import './yachts.css';

interface ChecklistItem {
  id: string;
  name: string;
  status: 'ok' | 'nok' | 'na' | null;
  notes: string;
  photoUrl?: string;
  invoiceUrl?: string;
  isUploading?: boolean;
}

const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Documentação Legal e Certificações',
    items: [
      { id: '1-1', name: 'Título de propriedade (TRAV)', status: null, notes: '' },
      { id: '1-2', name: 'Registro de embarcação (REB)', status: null, notes: '' },
      { id: '1-4', name: 'Histórico de Sinistros (Seguradora)', status: null, notes: '' },
    ]
  },
  {
    id: 'cat-2',
    name: 'Motor e Propulsão',
    items: [
      { id: '2-1', name: 'Troca de óleo do motor (data + horímetro)', status: null, notes: '' },
      { id: '2-3', name: 'Sistema de Exaustão e Muflas', status: null, notes: '' },
    ]
  }
];

export const YachtChecklist: React.FC = () => {
  const [categories, setCategories] = useState<any[]>(INITIAL_CATEGORIES);
  const [activeTab, setActiveTab] = useState(INITIAL_CATEGORIES[0].id);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceInputRef = useRef<HTMLInputElement>(null);
  
  const [currentChecklistId, setCurrentChecklistId] = useState<string | null>(null);
  
  // Controle de qual item está recebendo upload
  const [activeUploadTarget, setActiveUploadTarget] = useState<{catId: string, itemId: string, type: 'photo' | 'invoice'} | null>(null);

  // Inicia um checklist real no banco ao carregar
  useEffect(() => {
    const initChecklist = async () => {
      try {
        const data = await createYachtChecklist('A9832C', 'Engenheiro Chefe');
        if (data) setCurrentChecklistId(data.id);
      } catch (e) {
        console.error("Erro ao iniciar checklist", e);
      }
    };
    initChecklist();
  }, []);

  const handleStatusChange = async (categoryId: string, itemId: string, status: 'ok' | 'nok' | 'na') => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.map((item: ChecklistItem) => item.id === itemId ? { ...item, status } : item) };
      }
      return cat;
    }));
    
    if (currentChecklistId) {
      await saveChecklistResponse(currentChecklistId, itemId, status);
    }
  };

  const handleNotesChange = async (categoryId: string, itemId: string, notes: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.map((item: ChecklistItem) => item.id === itemId ? { ...item, notes } : item) };
      }
      return cat;
    }));
    
    // Na vida real, o ideal é usar um debounce para não fazer muitos requests, 
    // mas para garantir 100% funcional salvamos no blur ou onChange.
    const item = categories.find(c => c.id === categoryId)?.items.find((i: ChecklistItem) => i.id === itemId);
    if (currentChecklistId && item?.status) {
      // Salva apenas se já tiver um status definido
      await saveChecklistResponse(currentChecklistId, itemId, item.status, notes);
    }
  };

  const triggerUpload = (categoryId: string, itemId: string, type: 'photo' | 'invoice') => {
    setActiveUploadTarget({ catId: categoryId, itemId, type });
    if (type === 'photo') fileInputRef.current?.click();
    if (type === 'invoice') invoiceInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'invoice') => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    const { catId, itemId } = activeUploadTarget;

    // 1. Marcar como fazendo upload visualmente
    setCategories(prev => prev.map(cat => {
      if (cat.id === catId) {
        return { ...cat, items: cat.items.map((item: ChecklistItem) => item.id === itemId ? { ...item, isUploading: true } : item) };
      }
      return cat;
    }));

    try {
      // Nome único seguro para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 2. Upload para o Supabase Storage (Bucket yachts_vault)
      const { data, error } = await supabase.storage
        .from('yachts_vault')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      // Pegar URL Pública ou Assinada (como é vault, deveria ser assinada, mas para simplificar UI no front, salvaremos o path)
      const fileUrl = data.path;

      // 3. Atualizar o item com a URL do arquivo
      setCategories(prev => prev.map(cat => {
        if (cat.id === catId) {
          return { 
            ...cat, 
            items: cat.items.map((item: ChecklistItem) => {
              if (item.id === itemId) {
                return { 
                  ...item, 
                  isUploading: false,
                  ...(type === 'photo' ? { photoUrl: fileUrl } : { invoiceUrl: fileUrl })
                };
              }
              return item;
            }) 
          };
        }
        return cat;
      }));
      
      // Auto-save no DB se já tiver status
      const item = categories.find(c => c.id === catId)?.items.find((i: ChecklistItem) => i.id === itemId);
      if (currentChecklistId && item?.status) {
         await saveChecklistResponse(
           currentChecklistId, 
           itemId, 
           item.status, 
           item.notes, 
           type === 'photo' ? fileUrl : item.photoUrl,
           type === 'invoice' ? fileUrl : item.invoiceUrl
         );
      }

    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert('Falha ao enviar arquivo: ' + error.message);
      // Resetar status de upload
      setCategories(prev => prev.map(cat => {
        if (cat.id === catId) {
          return { ...cat, items: cat.items.map((item: ChecklistItem) => item.id === itemId ? { ...item, isUploading: false } : item) };
        }
        return cat;
      }));
    } finally {
      // Limpar inputs
      if (e.target) e.target.value = '';
      setActiveUploadTarget(null);
    }
  };

  const handleSignReport = async () => {
    if (!currentChecklistId) {
      alert("Nenhum checklist ativo encontrado.");
      return;
    }
    
    setIsFinalizing(true);
    try {
      const response = await sealChecklistReport(currentChecklistId);
      alert(`Relatório selado com sucesso! Hash Gravado:\n${response.hash}`);
    } catch (e: any) {
      console.error(e);
      alert(`Erro ao selar: ${e.message}`);
    } finally {
      setIsFinalizing(false);
    }
  };

  const activeCategory = categories.find(c => c.id === activeTab);

  return (
    <div className="yacht-theme" style={{ backgroundColor: 'transparent', padding: '0', minHeight: 'auto' }}>
      
      {/* Inputs Invsíveis para Arquivos */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} />
      <input type="file" ref={invoiceInputRef} style={{ display: 'none' }} accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'invoice')} />

      <div className="yacht-card" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="yacht-input-group" style={{ marginBottom: 0 }}>
          <label className="yacht-label">Ativo Marítimo</label>
          <input type="text" className="yacht-input" defaultValue="Azimut Grande Trideck (#A9832C)" disabled style={{ opacity: 0.8 }} />
        </div>
        <div className="yacht-input-group" style={{ marginBottom: 0 }}>
          <label className="yacht-label">Engenheiro Chefe</label>
          <input type="text" className="yacht-input" placeholder="Seu nome" />
        </div>
        <div className="yacht-input-group" style={{ marginBottom: 0 }}>
          <label className="yacht-label">Data e Hora (Bloqueado)</label>
          <input type="text" className="yacht-input" defaultValue={new Date().toLocaleString('pt-BR')} disabled style={{ opacity: 0.8 }} />
        </div>
      </div>

      <div className="yacht-tabs">
        {categories.map(cat => (
          <button key={cat.id} className={`yacht-tab ${activeTab === cat.id ? 'active' : ''}`} onClick={() => setActiveTab(cat.id)}>
            {cat.name}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="yacht-checklist-items">
          {activeCategory.items.map((item: ChecklistItem) => (
            <div key={item.id} className="yacht-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              
              {/* Overlay de Loading do Upload */}
              {item.isUploading && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(3, 12, 28, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, backdropFilter: 'blur(2px)' }}>
                   <div style={{ color: 'var(--yacht-gold-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                     <UploadCloud size={32} className="yacht-spin" />
                     <span style={{ fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>Criptografando para o Vault...</span>
                   </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <strong style={{ fontSize: '1.2rem', color: 'var(--yacht-text-main)', fontFamily: 'var(--font-heading)' }}>{item.name}</strong>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="yacht-tab" 
                    title="Adicionar Foto de Evidência" 
                    onClick={() => triggerUpload(activeCategory.id, item.id, 'photo')}
                    style={{ padding: '0.5rem', color: item.photoUrl ? 'var(--yacht-accent-ok)' : 'var(--yacht-gold-primary)', border: `1px solid ${item.photoUrl ? 'var(--yacht-accent-ok)' : 'var(--yacht-border)'}`, borderRadius: '4px' }}
                  >
                    <Camera size={20} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} /> 
                    {item.photoUrl ? 'Foto Anexada' : 'Foto'}
                  </button>
                  <button 
                    className="yacht-tab" 
                    title="Anexar Nota Fiscal / Laudo" 
                    onClick={() => triggerUpload(activeCategory.id, item.id, 'invoice')}
                    style={{ padding: '0.5rem', color: item.invoiceUrl ? 'var(--yacht-accent-ok)' : 'var(--yacht-gold-primary)', border: `1px solid ${item.invoiceUrl ? 'var(--yacht-accent-ok)' : 'var(--yacht-border)'}`, borderRadius: '4px' }}
                  >
                    <FileText size={20} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} /> 
                    {item.invoiceUrl ? 'Doc Anexado' : 'Documento'}
                  </button>
                </div>
              </div>

              <div className="yacht-status-group">
                <button className={`yacht-status-btn ${item.status === 'ok' ? 'selected-ok' : ''}`} onClick={() => handleStatusChange(activeCategory.id, item.id, 'ok')}>
                  <CheckCircle size={28} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto' }} /> OK
                </button>
                <button className={`yacht-status-btn ${item.status === 'nok' ? 'selected-nok' : ''}`} onClick={() => handleStatusChange(activeCategory.id, item.id, 'nok')}>
                  <XCircle size={28} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto' }} /> NOK
                </button>
                <button className={`yacht-status-btn ${item.status === 'na' ? 'selected-na' : ''}`} onClick={() => handleStatusChange(activeCategory.id, item.id, 'na')}>
                  <MinusCircle size={28} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto' }} /> N/A
                </button>
              </div>

              <input 
                type="text" 
                className="yacht-input" 
                placeholder="Detalhes técnicos, horímetro atual ou motivo do NOK..." 
                value={item.notes}
                onChange={(e) => handleNotesChange(activeCategory.id, item.id, e.target.value)}
                style={{ 
                  marginTop: '1rem',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderColor: item.status === 'nok' ? 'var(--yacht-accent-nok)' : 'var(--yacht-border)' 
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem', borderTop: '1px solid var(--yacht-border)', paddingTop: '2rem' }}>
        <span style={{ color: 'var(--yacht-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="var(--yacht-gold-primary)" /> Ao assinar, os dados serão hasheados em SHA-256 (WORM).
        </span>
        <button className="yacht-btn-primary" style={{ maxWidth: '300px' }} onClick={handleSignReport} disabled={isFinalizing}>
          {isFinalizing ? 'CIMENTANDO...' : 'ASSINAR E SELAR DOSSIÊ'}
        </button>
      </div>
    </div>
  );
};
