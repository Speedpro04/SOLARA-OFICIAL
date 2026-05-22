import React from 'react';
import { ShieldCheck, Anchor, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import './yachts.css';

// Componente para a visualização do Dono da Embarcação
// Focado em Leitura, Beleza e Confiança (Hash, Assinatura)

export const YachtReport: React.FC = () => {
  // Dados mockados representando um relatório concluído do backend
  const reportData = {
    yachtName: "Azimut 74 'Golden Sea'",
    registration: "BR-998877",
    technician: "Carlos Almeida (Eng. Chefe)",
    dateCompleted: "21 de Maio de 2026",
    hash: "a8f5f167f44f4964e6c998dee827110c", // SHA-256 parcial para visualização
    status: "APPROVED",
    summary: {
      ok: 42,
      nok: 2,
      na: 5
    },
    criticalAlerts: [
      { id: 1, item: "Sistema de Exaustão e Muflas", issue: "Sinal de corrosão inicial na mufla de BB. Recomendada troca em 3 meses." },
      { id: 2, item: "Extintor de incêndio", issue: "Validade expira no próximo mês." }
    ]
  };

  return (
    <div className="yacht-theme">
      {/* Cabeçalho do Relatório */}
      <div className="yacht-report-header">
        <Anchor size={64} color="var(--yacht-gold-primary)" style={{ margin: '0 auto 1rem' }} />
        <h1 className="yacht-title">{reportData.yachtName}</h1>
        <p className="yacht-subtitle">Relatório Técnico Oficial - {reportData.dateCompleted}</p>
        
        <div className="yacht-hash-badge">
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
          ID de Autenticidade: {reportData.hash}
        </div>
      </div>

      {/* Resumo Executivo (Painel Superior) */}
      <h3 className="yacht-heading-2">Visão Geral da Embarcação</h3>
      <div className="yacht-grid-summary">
        <div className="yacht-summary-box">
          <div className="yacht-summary-value" style={{ color: 'var(--yacht-accent-ok)' }}>{reportData.summary.ok}</div>
          <div className="yacht-summary-label">Itens Conformes</div>
        </div>
        <div className="yacht-summary-box" style={{ borderColor: reportData.summary.nok > 0 ? 'var(--yacht-accent-nok)' : 'var(--yacht-border)' }}>
          <div className="yacht-summary-value" style={{ color: reportData.summary.nok > 0 ? 'var(--yacht-accent-nok)' : 'var(--yacht-gold-light)' }}>{reportData.summary.nok}</div>
          <div className="yacht-summary-label">Atenção Necessária</div>
        </div>
        <div className="yacht-summary-box">
          <div className="yacht-summary-value" style={{ color: 'var(--yacht-text-muted)' }}>{reportData.summary.na}</div>
          <div className="yacht-summary-label">Não Aplicáveis</div>
        </div>
      </div>

      {/* Alertas Críticos (Se houver NOKs) */}
      {reportData.criticalAlerts.length > 0 && (
        <div className="yacht-card" style={{ borderLeft: '4px solid var(--yacht-accent-nok)' }}>
          <h3 style={{ color: 'var(--yacht-accent-nok)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} />
            Atenção Necessária (NOK)
          </h3>
          <p style={{ color: 'var(--yacht-text-muted)', marginBottom: '1.5rem' }}>
            Os itens abaixo requerem sua aprovação para manutenção corretiva:
          </p>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {reportData.criticalAlerts.map(alert => (
              <li key={alert.id} style={{ marginBottom: '1rem', background: 'var(--yacht-bg-dark)', padding: '1rem', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--yacht-text-main)', display: 'block' }}>{alert.item}</strong>
                <span style={{ color: 'var(--yacht-text-muted)' }}>{alert.issue}</span>
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="yacht-tab" style={{ padding: '0', color: 'var(--yacht-gold-primary)', fontSize: '0.9rem' }}>
                    <FileText size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    Ver Fotos da Inspeção
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assinatura Digital e Governança */}
      <h3 className="yacht-heading-2">Governança e Responsabilidade</h3>
      <div className="yacht-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <p style={{ color: 'var(--yacht-text-muted)', marginBottom: '0.5rem' }}>Inspecionado e Assinado Digitalmente por:</p>
          <strong style={{ fontSize: '1.2rem', color: 'var(--yacht-gold-light)', display: 'block' }}>{reportData.technician}</strong>
          <span style={{ fontSize: '0.9rem', color: 'var(--yacht-text-muted)' }}>Registro: CREA-SP / Marinha do Brasil</span>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          {/* Simulação visual de um selo de assinatura digital ou QR code */}
          <div style={{ width: '100px', height: '100px', border: '2px dashed var(--yacht-gold-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', opacity: 0.5 }}>
            QR Code
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--yacht-gold-primary)', marginTop: '0.5rem', display: 'block' }}>Verificar Autenticidade</span>
        </div>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button className="yacht-btn-primary" style={{ maxWidth: '400px' }}>
          Baixar Relatório em PDF Certificado
        </button>
      </div>

    </div>
  );
};
