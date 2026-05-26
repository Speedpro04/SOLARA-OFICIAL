import { Globe, MessageCircle, Mail, ExternalLink, ShieldCheck, Crown } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  specialty: string;
  site: string;
  isEmptySlot?: boolean;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  partners: Partner[];
}

const generateEmptySlot = (id: string): Partner => ({
  id,
  name: 'Espaço Exclusivo',
  specialty: 'Torne-se um fornecedor homologado Solara Connect e anuncie aqui.',
  site: '',
  isEmptySlot: true
});

const partnersData: Category[] = [
  {
    id: 'equip-odonto',
    title: 'Equipamentos Odontológicos',
    icon: '🦷',
    partners: [
      { id: '1', name: 'Gnatus', specialty: 'Fabricante BR líder — cadeiras/raio-x/scanner', site: 'gnatus.com.br' },
      { id: '2', name: 'Saevo', specialty: 'Cadeiras odontológicas — grupo Odonto Equipamentos', site: 'shopsaevo.com.br' },
      { id: '3', name: 'Olsen', specialty: 'Fabricante SC — equipamentos odonto/médico', site: 'olsen.odo.br' },
      { id: '4', name: 'Xdent', specialty: 'Fabricante + manutenção equipamentos', site: 'xdent.com.br' },
      { id: '5', name: 'Dental Odonto', specialty: 'Maior loja virtual odontológica BR', site: 'dentalodonto.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'diag-imagem',
    title: 'Diagnóstico por Imagem',
    icon: '📷',
    partners: [
      { id: '1', name: 'Gnatus Imagem', specialty: 'Raio-x panorâmico/portátil/scanner intraoral', site: 'gnatus.com.br' },
      { id: '2', name: 'Dental Speed', specialty: 'Raio-x Gnatus/D700/Micro Imagem', site: 'dentalspeed.com' },
      { id: '3', name: 'Dental Cremer', specialty: 'Raio-x digital/sensores radiográficos', site: 'dentalcremer.com.br' },
      { id: '4', name: 'RaioX Prox', specialty: 'Especialista raio-x odontológico de alto nível', site: 'raioxprox.com.br' },
      { id: '5', name: 'BCMED', specialty: 'Ultrassom terapêutico/diagnóstico clínicas', site: 'bcmed.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'insumos-odonto',
    title: 'Materiais e Insumos',
    icon: '📦',
    partners: [
      { id: '1', name: 'Dental Speed', specialty: 'Distribuidora FGM/Dentsply/Ultradent', site: 'dentalspeed.com' },
      { id: '2', name: 'Dental Cremer', specialty: 'Insumos/materiais dentários nacional', site: 'dentalcremer.com.br' },
      { id: '3', name: 'Dental Focus', specialty: 'Prótese dentária/materiais Santo André SP', site: 'dentalfocus.com.br' },
      { id: '4', name: 'Frantins', specialty: 'Fabricante polímeros PMMA/CAD-CAM/resinas', site: 'frantins.com.br' },
      { id: '5', name: 'Dental Ita', specialty: 'Especialista laboratório prótese dentária', site: 'dentalita.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'equip-estetica',
    title: 'Estética e Emagrecimento',
    icon: '✨',
    partners: [
      { id: '1', name: 'Ibramed', specialty: 'Ultrassom terapêutico/Sonopulse — referência', site: 'ibramed.com.br' },
      { id: '2', name: 'BCMED', specialty: 'Cavitação/radiofrequência/eletroterapia', site: 'bcmed.com.br' },
      { id: '3', name: 'KLD Biosistemas', specialty: 'Radiofrequência/laser/equipamentos estéticos', site: 'kldbiosistemas.com.br' },
      { id: '4', name: 'Body Health Brasil', specialty: 'HImFU/criofrequência/modelagem corporal', site: 'bodyhealthbrasil.com' },
      { id: '5', name: 'Casa da Estética', specialty: 'Distribuidor equipamentos estética 26 anos', site: 'casadaestetica.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'fisioterapia',
    title: 'Fisioterapia e Reabilitação',
    icon: '🏃',
    partners: [
      { id: '1', name: 'Ibramed', specialty: 'Ultrassom/eletroestimulação/reabilitação', site: 'ibramed.com.br' },
      { id: '2', name: 'BCMED', specialty: 'Eletroterapia/fototerapia/fisioterapia', site: 'bcmed.com.br' },
      { id: '3', name: 'Quark Medical', specialty: 'Equipamentos fisioterapia/reabilitação', site: 'quarkmed.com.br' },
      { id: '4', name: 'Fisiofort', specialty: 'Equipamentos fisioterapia profissional', site: 'fisiofort.com.br' },
      { id: '5', name: 'Hospimetal', specialty: 'Mesas/macas fisioterapia', site: 'hospimetal.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'mobiliario',
    title: 'Mobiliário Clínico',
    icon: '🪑',
    partners: [
      { id: '1', name: 'Medical Company', specialty: 'Fabricante macas/cabines/móveis clínicos', site: 'medicalcompany.com.br' },
      { id: '2', name: 'Lafaiete', specialty: 'Móveis médicos 59 anos — SP', site: 'lafaiete.com.br' },
      { id: '3', name: 'Casa Médica', specialty: 'Macas/mesas/mobiliário hospitalar', site: 'casamedica.com.br' },
      { id: '4', name: 'Petronio Movelaria', specialty: 'Macas consultório/clínica estética', site: 'petroniomovelaria.com.br' },
      { id: '5', name: 'Odonto Equipamentos', specialty: 'Mobiliário odonto/médico/estético', site: 'odontoequipamentos.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'laboratorio',
    title: 'Análises e Laboratório',
    icon: '🔬',
    partners: [
      { id: '1', name: 'Dentsply Sirona', specialty: 'Equipamentos lab/CAD-CAM dental', site: 'dentsplysirona.com/br' },
      { id: '2', name: 'Schuster', specialty: 'Equipamentos laboratório prótese', site: 'schuster.com.br' },
      { id: '3', name: 'FGM Dental Group', specialty: 'Materiais dentários/lab fabricante BR', site: 'fgm.ind.br' },
      { id: '4', name: 'Dental Focus', specialty: 'Equipamentos lab prótese — desde 2004', site: 'dentalfocus.com.br' },
      { id: '5', name: 'AllPrime', specialty: 'Materiais odontológicos laboratório', site: 'allprime.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'seguros',
    title: 'Seguros para Clínicas',
    icon: '🛡️',
    partners: [
      { id: '1', name: 'Porto Seguro Saúde', specialty: 'Seguro equipamentos/RC profissional médico', site: 'portoseguro.com.br' },
      { id: '2', name: 'Bradesco Saúde', specialty: 'Plano saúde empresarial clínicas', site: 'bradescooperadorasdesaude.com.br' },
      { id: '3', name: 'SulAmérica', specialty: 'RC médico + seguro equipamentos', site: 'sulamerica.com.br' },
      { id: '4', name: 'Allianz Saúde', specialty: 'Seguro responsabilidade civil profissional', site: 'allianz.com.br' },
      { id: '5', name: 'Zurich Seguros', specialty: 'Seguros empresariais clínicas/consultórios', site: 'zurich.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'financiamentos',
    title: 'Financiamento de Equipamentos',
    icon: '💰',
    partners: [
      { id: '1', name: 'Santander Financiamentos', specialty: 'Crédito equipamentos médicos/odonto', site: 'santander.com.br' },
      { id: '2', name: 'BNDES Finame', specialty: 'Financiamento equipamentos saúde', site: 'bndes.gov.br' },
      { id: '3', name: 'Sicoob Saúde', specialty: 'Crédito cooperativa médicos/dentistas', site: 'sicoob.com.br' },
      { id: '4', name: 'BV Financeira', specialty: 'Crédito clínicas PJ', site: 'bv.com.br' },
      { id: '5', name: 'CrediMédico', specialty: 'Financiamento especializado saúde', site: 'credimedico.com.br' },
      generateEmptySlot('6')
    ]
  },
  {
    id: 'uniformes',
    title: 'Uniformes e Descartáveis',
    icon: '🥼',
    partners: [
      { id: '1', name: 'Preven', specialty: 'Materiais/descartáveis odontológicos', site: 'preven.com.br' },
      { id: '2', name: 'Medix Brasil', specialty: 'Descartáveis/EPIs hospitalares', site: 'medixbrasil.com.br' },
      { id: '3', name: 'Cremer', specialty: 'Materiais descartáveis/curativos/EPIs', site: 'cremer.com.br' },
      { id: '4', name: 'Camlab', specialty: 'Jaleco/uniforme clínico', site: 'camlab.com.br' },
      { id: '5', name: 'Hospdent', specialty: 'Descartáveis odontológicos/clínicos', site: 'hospdent.com.br' },
      generateEmptySlot('6')
    ]
  }
];

export default function PartnersPage() {
  return (
    <div style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <Crown size={36} color="#130f40" />
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#130f40' }}>
            Partnership Premium
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: 4 }}>O maior hub de fornecedores homologados para a sua clínica.</p>
        </div>
      </div>

      {partnersData.map((category) => (
        <div key={category.id} style={{ marginBottom: 64 }}>
          {/* Cabeçalho da Categoria com linha divisória de 2px azul */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>{category.icon}</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#130f40', margin: 0 }}>
                {category.title}
              </h3>
            </div>
            {/* Linha Divisória de 2px Azul da Marca (#7ed6df) */}
            <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, #7ed6df 0%, rgba(126,214,223,0.1) 100%)', borderRadius: 2 }} />
          </div>

          {/* Grid de Cards (3 colunas exatas) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 24 
          }}>
            {category.partners.map((partner) => (
              <div
                key={partner.id}
                style={{
                  background: partner.isEmptySlot ? 'rgba(255,255,255,0.5)' : '#fff',
                  border: partner.isEmptySlot ? '2px dashed rgba(126,214,223,0.4)' : '0.5px solid #222f3e',
                  borderRadius: 2,
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  boxShadow: partner.isEmptySlot ? 'none' : '0 10px 30px rgba(0,0,0,0.03)',
                  height: '100%',
                  minHeight: 75
                }}
                onMouseEnter={(e) => {
                  if (!partner.isEmptySlot) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(126,214,223,0.2)';
                  } else {
                    e.currentTarget.style.background = 'rgba(126,214,223,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(126,214,223,0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!partner.isEmptySlot) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
                  } else {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(126,214,223,0.4)';
                  }
                }}
              >
                {!partner.isEmptySlot && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)', color: '#fff', padding: '4px 10px', borderRadius: 2, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 10px rgba(19,15,64,0.3)' }}>
                    <ShieldCheck size={12} color="#7ed6df" /> HOMOLOGADO
                  </div>
                )}

                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 500, 
                    color: partner.isEmptySlot ? 'rgba(19,15,64,0.4)' : '#130f40', 
                    margin: 0,
                    letterSpacing: '-0.5px',
                    paddingRight: partner.isEmptySlot ? 0 : 100
                  }}>
                    {partner.name}
                  </h3>
                </div>

                {!partner.isEmptySlot ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0 16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#222f3e', fontSize: '17px', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} 
                         onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                         onMouseLeave={e => e.currentTarget.style.color = '#222f3e'}
                         onClick={() => window.open(`https://${partner.site}`, '_blank')}>
                      <Globe size={17} /> {partner.site} <ExternalLink size={15} style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0 16px 0' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', margin: 0, fontWeight: 500 }}>
                      {partner.specialty}
                    </p>
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', width: '100%' }}>
                  {partner.isEmptySlot ? (
                    <button style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: 2, 
                      border: '1px solid rgba(126,214,223,0.5)', 
                      background: 'rgba(126,214,223,0.05)',
                      color: '#130f40', 
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(126,214,223,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(126,214,223,0.05)';
                    }}
                    >
                      Quero Anunciar Aqui
                    </button>
                  ) : (
                    <button style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: 2, 
                      border: 'none', 
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', 
                      color: '#fff', 
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(37, 211, 102, 0.2)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onClick={() => window.open(`https://${partner.site}`, '_blank')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.2)';
                    }}
                    >
                      <Globe size={18} /> Acesse o site
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
