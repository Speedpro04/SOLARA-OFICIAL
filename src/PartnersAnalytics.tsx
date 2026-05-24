import React, { useState } from 'react';
import { Download, Search, Filter, TrendingUp, Users, ExternalLink } from 'lucide-react';

const mockAnalytics = [
  { id: '1', name: 'Gnatus', category: 'Equipamentos Odontológicos', whatsapp: 145, email: 32, total: 177, status: 'Ativo' },
  { id: '2', name: 'Dental Speed', category: 'Insumos / Imagem', whatsapp: 210, email: 55, total: 265, status: 'Ativo' },
  { id: '3', name: 'Ibramed', category: 'Estética e Fisioterapia', whatsapp: 89, email: 12, total: 101, status: 'Ativo' },
  { id: '4', name: 'Porto Seguro Saúde', category: 'Seguros para Clínicas', whatsapp: 45, email: 88, total: 133, status: 'Ativo' },
  { id: '5', name: 'Santander Financiamentos', category: 'Financiamentos', whatsapp: 112, email: 41, total: 153, status: 'Ativo' },
  { id: '6', name: 'BCMED', category: 'Diagnóstico e Estética', whatsapp: 67, email: 19, total: 86, status: 'Ativo' },
  { id: '7', name: 'Dental Cremer', category: 'Insumos / Imagem', whatsapp: 188, email: 64, total: 252, status: 'Ativo' },
  { id: '8', name: 'Medical Company', category: 'Mobiliário Clínico', whatsapp: 34, email: 11, total: 45, status: 'Ativo' },
  { id: '9', name: 'Dentsply Sirona', category: 'Análises e Laboratório', whatsapp: 56, email: 23, total: 79, status: 'Ativo' },
  { id: '10', name: 'Preven', category: 'Uniformes e Descartáveis', whatsapp: 92, email: 14, total: 106, status: 'Ativo' },
];

export default function PartnersAnalytics() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockAnalytics
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.total - a.total); // Ordena por total de cliques decrescente

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ marginTop: 40 }}>
      {/* Estilos para Impressão PDF */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div id="printable-report" style={{ background: '#fff', borderRadius: 28, padding: '32px', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#130f40', marginBottom: 4 }}>Performance de Parceiros</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Relatório de cliques e engajamento do Marketplace B2B Solara Connect.</p>
          </div>
          
          <button 
            onClick={handlePrint}
            className="no-print"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              background: 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: 12, 
              fontWeight: 600, 
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(19,15,64,0.2)'
            }}
          >
            <Download size={18} /> Exportar PDF
          </button>
        </div>

        <div className="no-print" style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: 14 }} />
            <input 
              type="text" 
              placeholder="Buscar por fornecedor ou categoria..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Fornecedor</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Categoria</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>Cliques WhatsApp</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>Cliques E-mail</th>
                <th style={{ padding: '16px', color: '#130f40', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>Total Interações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#130f40' }}>{item.name}</td>
                  <td style={{ padding: '16px', color: '#64748b', fontSize: '0.9rem' }}>{item.category}</td>
                  <td style={{ padding: '16px', textAlign: 'center', color: '#25D366', fontWeight: 600 }}>{item.whatsapp}</td>
                  <td style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{item.email}</td>
                  <td style={{ padding: '16px', textAlign: 'center', color: '#130f40', fontWeight: 800 }}>{item.total}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    Nenhum fornecedor encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Resumo Rodapé para PDF */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem' }}>
          <div>Relatório gerado automaticamente por <strong>Solara Connect Analytics</strong>.</div>
          <div>Total de Parceiros Listados: <strong>{filteredData.length}</strong></div>
        </div>

      </div>
    </div>
  );
}
