import { useState, useMemo, useEffect } from 'react';
import { Globe, ShieldCheck, Crown, Search, MapPin, Sparkles, Filter } from 'lucide-react';
import { supabase } from './lib/supabase';

interface Partner {
  id: string;
  name: string;
  specialty: string;
  site: string;
  region: 'nacional' | 'vale';
  location: string;
  category_id?: string;
  isEmptySlot?: boolean;
}


const generateEmptySlot = (id: string, categoryTitle: string, region: 'nacional' | 'vale' = 'nacional'): Partner => ({
  id,
  name: 'Espaço Exclusivo',
  specialty: `Torne-se um fornecedor de ${categoryTitle.toLowerCase()} homologado e impulsione suas vendas no Solara Connect.`,
  site: '',
  region,
  location: region === 'vale' ? 'Vale do Paraíba' : 'Brasil',
  isEmptySlot: true
});

const categoriesList = [
  { id: 'equip-odonto', title: 'Equipamentos Odontológicos', icon: '🦷' },
  { id: 'diag-imagem', title: 'Diagnóstico por Imagem', icon: '🩻' },
  { id: 'uniformes', title: 'Uniformes e Descartáveis', icon: '🥼' },
  { id: 'residuos', title: 'Gestão e Coleta de Resíduos', icon: '♻️' },
  { id: 'regional-vale', title: 'Regional Vale do Paraíba', icon: '📍' },
  { id: 'fisioterapia', title: 'Fisioterapia e Reabilitação', icon: '🏃' },
  { id: 'endoscopia', title: 'Endoscopia e Torres de Vídeo', icon: '🩺' },
  { id: 'insumos-odonto', title: 'Materiais e Insumos', icon: '📦' },
  { id: 'equip-estetica', title: 'Estética e Emagrecimento', icon: '✨' },
  { id: 'mobiliario', title: 'Mobiliário Clínico', icon: '🪑' },
  { id: 'laboratorio', title: 'Análises e Laboratório', icon: '🔬' },
  { id: 'seguros', title: 'Seguros para Clínicas', icon: '🛡️' },
  { id: 'financiamentos', title: 'Financiamento de Equipamentos', icon: '💰' }
];
const staticPartners: Partner[] = [
  // Insumos Odontológicos
  { id: '1', name: 'Dental Cremer', specialty: 'Maior centro de distribuição da América Latina', site: 'https://www.dentalcremer.com.br', region: 'nacional', location: 'Brasil', category_id: 'insumos-odonto' },
  { id: '2', name: 'Dental Speed', specialty: 'Grande e-commerce nacional especializado', site: 'https://www.dentalspeed.com', region: 'nacional', location: 'Brasil', category_id: 'insumos-odonto' },
  { id: '3', name: 'Surya Dental', specialty: 'Distribuidora tradicional com clube de vantagens', site: 'https://www.suryadental.com.br', region: 'nacional', location: 'Brasil', category_id: 'insumos-odonto' },
  { id: '4', name: 'Dental Master', specialty: 'Distribuidora com forte capilaridade em SP', site: 'https://www.dentalmaster.com.br', region: 'nacional', location: 'São Paulo', category_id: 'insumos-odonto' },
  { id: '5', name: 'Dentalshop', specialty: 'Focada em entregas rápidas de insumos clínicos', site: 'https://www.dentalshop.com.br', region: 'nacional', location: 'Brasil', category_id: 'insumos-odonto' },
  { id: '6', name: 'FB Odonto', specialty: 'Venda integrada de descartáveis e peças', site: '#', region: 'nacional', location: 'Brasil', category_id: 'insumos-odonto' },

  // Equipamentos Odontológicos
  { id: '7', name: 'Gnatus', specialty: 'Fabricantes nacionais de consultórios', site: 'https://www.gnatus.com.br', region: 'nacional', location: 'Brasil', category_id: 'equip-odonto' },
  { id: '8', name: 'Olsen', specialty: 'Cadeiras premium de alta durabilidade', site: 'https://www.olsen.odo.br', region: 'nacional', location: 'Brasil', category_id: 'equip-odonto' },
  { id: '9', name: 'Dabi Atlante', specialty: 'Líder em cadeiras e conjuntos clínicos avançados', site: 'https://www.dabiatlante.com.br', region: 'nacional', location: 'Brasil', category_id: 'equip-odonto' },
  { id: '10', name: 'Saevo', specialty: 'Foco em custo-benefício e ergonomia', site: 'https://www.saevo.com.br', region: 'nacional', location: 'Brasil', category_id: 'equip-odonto' },
  { id: '11', name: 'Kavo', specialty: 'Equipamentos e peças de alta performance', site: 'https://www.kavo.com/pt-br', region: 'nacional', location: 'Brasil', category_id: 'equip-odonto' },
  { id: '12', name: 'Woson', specialty: 'Biossegurança e automação de consultórios', site: 'https://www.woson.com.br', region: 'nacional', location: 'Brasil', category_id: 'equip-odonto' },

  // Diagnóstico por Imagem
  { id: '13', name: 'GE HealthCare', specialty: 'Tecnologia em ultrassom e equipamentos pesados', site: 'https://www.gehealthcare.com.br', region: 'nacional', location: 'Brasil', category_id: 'diag-imagem' },
  { id: '14', name: 'Siemens Healthineers', specialty: 'Sistemas de imagem médica de alta fidelidade', site: 'https://www.siemens-healthineers.com/br', region: 'nacional', location: 'Brasil', category_id: 'diag-imagem' },
  { id: '15', name: 'Mindray Brasil', specialty: 'Custo-benefício em sistemas de ultrassom clínico', site: 'https://www.mindray.com/br', region: 'nacional', location: 'Brasil', category_id: 'diag-imagem' },
  { id: '16', name: 'Dabi Atlante Imagem', specialty: 'Radiologia digital e tomógrafos odontológicos', site: 'https://www.dabiatlante.com.br', region: 'nacional', location: 'Brasil', category_id: 'diag-imagem' },
  { id: '17', name: 'Vatech Brasil', specialty: 'Líder em radiologia odontológica digital', site: 'https://www.vatechbrasil.com.br', region: 'nacional', location: 'Brasil', category_id: 'diag-imagem' },
  { id: '18', name: 'PreXion X-Ray', specialty: 'Aparelhos de Raio-X compactos para consultórios', site: 'https://prexion.com', region: 'nacional', location: 'Brasil', category_id: 'diag-imagem' },

  // Uniformes e Descartáveis
  { id: '19', name: 'Cremer', specialty: 'Fornecedora massiva de descartáveis cirúrgicos', site: 'https://www.cremer.com.br', region: 'nacional', location: 'Brasil', category_id: 'uniformes' },
  { id: '20', name: 'Cirúrgica Fernandes', specialty: 'Distribuidora de correlatos e descartáveis', site: 'https://www.cfernandes.com.br', region: 'nacional', location: 'Brasil', category_id: 'uniformes' },
  { id: '21', name: 'MA Hospitalar', specialty: 'Do insumo básico ao equipamento de proteção', site: 'https://www.mahospitalar.com.br', region: 'nacional', location: 'Brasil', category_id: 'uniformes' },
  { id: '22', name: 'Dufarma', specialty: 'Canal logístico para descartáveis de alto giro', site: 'https://www.dufarma.com.br', region: 'nacional', location: 'Brasil', category_id: 'uniformes' },
  { id: '23', name: 'Dra. Cherie', specialty: 'Jalecos e uniformes premium de alta costura', site: 'https://www.dracherie.com.br', region: 'nacional', location: 'Brasil', category_id: 'uniformes' },
  { id: '24', name: 'Uniformes Profissionais', specialty: 'Confecção em escala de uniformes clínicos', site: '#', region: 'nacional', location: 'Brasil', category_id: 'uniformes' },

  // Resíduos
  { id: '25', name: 'Corpus Saneamento', specialty: 'Gerenciamento de lixo hospitalar', site: 'https://www.corpus.com.br', region: 'nacional', location: 'Brasil', category_id: 'residuos' },
  { id: '26', name: 'Mig Lix', specialty: 'Incineração e destinação em SP', site: 'https://www.miglix.com.br', region: 'nacional', location: 'São Paulo', category_id: 'residuos' },
  { id: '27', name: 'Loga', specialty: 'Gestão de resíduos de saúde de grandes áreas', site: 'https://www.loga.com.br', region: 'nacional', location: 'São Paulo', category_id: 'residuos' },
  { id: '28', name: 'Ecourbis Ambiental', specialty: 'Tratamento e destinação final homologada', site: 'https://www.ecourbis.com.br', region: 'nacional', location: 'São Paulo', category_id: 'residuos' },
  { id: '29', name: 'Resiforte', specialty: 'Gerenciamento de resíduos biológicos', site: 'https://www.resiforte.com.br', region: 'nacional', location: 'Brasil', category_id: 'residuos' },
  { id: '30', name: 'Sustentare Saneamento', specialty: 'Coleta e tratamento de resíduos infectantes', site: 'https://www.sustentaresaneamento.com.br', region: 'nacional', location: 'Brasil', category_id: 'residuos' }
];

interface PartnersPageProps {
  clinicId?: string;
}

export default function PartnersPage({ clinicId }: PartnersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [regionFilter, setRegionFilter] = useState<'all' | 'nacional' | 'vale'>('all');
  const [partnersList, setPartnersList] = useState<Partner[]>(staticPartners);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from('solara_partners')
          .select('*');
        if (error) {
          console.warn('Erro ao carregar parceiros do banco (tabela pode estar vazia):', error.message);
          return;
        }
        setPartnersList([...staticPartners, ...(data || [])]);
      } catch (err) {
        console.error('Erro ao ler parceiros do Supabase:', err);
      }
    };

    fetchPartners();
  }, []);

  const partnersData = useMemo(() => {
    return categoriesList.map(cat => {
      const catPartners = partnersList.filter(p => p.category_id === cat.id);
      // Garantir que a soma de parceiros reais + slot vazio dê no máximo 6 cards
      const combined = [
        ...catPartners,
        generateEmptySlot(`${cat.id}-empty`, cat.title, cat.id === 'regional-vale' ? 'vale' : 'nacional')
      ].slice(0, 6);
      return {
        ...cat,
        partners: combined
      };
    });
  }, [partnersList]);

  // Rastreamento assíncrono e não-bloqueante de cliques manuais no Supabase
  const trackPartnerClick = async (partner: Partner, clickType: 'website' | 'whatsapp', categoryTitle: string) => {
    try {
      const { error } = await supabase
        .from('solara_partners_clicks')
        .insert([{
          partner_id: partner.id,
          partner_name: partner.name,
          category_title: categoryTitle,
          click_type: clickType,
          clinic_id: clinicId || null
        }]);
      if (error) {
        console.warn('Erro silencioso ao registrar clique no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('Erro ao processar registro de clique:', err);
    }
  };

  const filteredData = useMemo(() => {
    return partnersData
      .map((cat) => {
        // Filtrar parceiros em cada categoria
        const filteredPartners = cat.partners.filter((partner) => {
          // Filtro por Região
          if (regionFilter !== 'all' && partner.region !== regionFilter) {
            return false;
          }

          // Filtro por Busca (Nome, Especialidade ou Cidade/Localização)
          if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            const nameMatch = partner.name.toLowerCase().includes(query);
            const specMatch = partner.specialty.toLowerCase().includes(query);
            const locMatch = partner.location.toLowerCase().includes(query);
            const catMatch = cat.title.toLowerCase().includes(query);

            return nameMatch || specMatch || locMatch || catMatch;
          }

          return true;
        });

        return {
          ...cat,
          partners: filteredPartners,
        };
      })
      // Filtrar categorias vazias e aplicar aba selecionada
      .filter((cat) => {
        if (activeCategoryTab !== 'all' && cat.id !== activeCategoryTab) {
          return false;
        }
        return cat.partners.length > 0;
      });
  }, [searchTerm, activeCategoryTab, regionFilter, partnersData]);

  const totalPartnersCount = useMemo(() => {
    return filteredData.reduce((acc, cat) => acc + cat.partners.filter(p => !p.isEmptySlot).length, 0);
  }, [filteredData]);

  // Função para simular o clique e contato de WhatsApp de parcerias do Solara Connect
  const handleBecomePartner = (catName: string) => {
    const text = encodeURIComponent(`Olá Solara Connect! Tenho interesse em homologar minha empresa como parceira oficial de "${catName}" no portal de parcerias premium.`);
    window.open(`https://wa.me/5512997184000?text=${text}`, '_blank');
  };

  return (
    <div style={{ 
      paddingTop: '24px', 
      paddingBottom: '80px', 
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: '#1e293b'
    }}>
      {/* Cabeçalho Premium com Efeito de Vidro */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '3px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)',
            padding: '16px',
            borderRadius: '3px',
            boxShadow: '0 10px 25px rgba(19, 15, 64, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={36} color="#7ed6df" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 700, margin: 0, color: '#130f40', letterSpacing: '-1px' }}>
                Partnership Premium
              </h2>
              <span style={{ 
                background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)', 
                color: '#fff', 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                padding: '4px 10px', 
                borderRadius: '9999px',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
                letterSpacing: '0.5px'
              }}>
                EXCLUSIVO
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '6px', margin: 0, fontWeight: 400 }}>
              O maior hub homologado de suprimentos, equipamentos de ponta e resíduos para sua clínica médica ou odontológica.
            </p>
          </div>
        </div>
      </div>

      {/* Controles de Busca e Filtros Dinâmicos (Painel Premium) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '3px',
        padding: '24px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.02)',
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Linha 1: Input de Busca e Botões de Região */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Caixa de Busca Inteligente */}
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '15px' }} />
            <input 
              type="text" 
              placeholder="Buscar por marca, cidade (Taubaté, SJC...), especialidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px 14px 48px', 
                borderRadius: '3px', 
                border: '1.5px solid #e2e8f0', 
                outline: 'none', 
                fontSize: '1rem',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#130f40';
                e.target.style.boxShadow = '0 0 0 4px rgba(19, 15, 64, 0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Filtro de Abrangência Regional vs Nacional */}
          <div style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            padding: '4px', 
            borderRadius: '3px', 
            border: '1px solid #e2e8f0' 
          }}>
            <button 
              onClick={() => setRegionFilter('all')}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: '3px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                background: regionFilter === 'all' ? '#130f40' : 'transparent',
                color: regionFilter === 'all' ? '#fff' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              Todos ({partnersData.reduce((acc, cat) => acc + cat.partners.length, 0)})
            </button>
            <button 
              onClick={() => setRegionFilter('nacional')}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: '3px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                background: regionFilter === 'nacional' ? '#130f40' : 'transparent',
                color: regionFilter === 'nacional' ? '#fff' : '#475569',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Globe size={15} /> Nacionais
            </button>
            <button 
              onClick={() => setRegionFilter('vale')}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: '3px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                background: regionFilter === 'vale' ? '#130f40' : 'transparent',
                color: regionFilter === 'vale' ? '#fff' : '#475569',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MapPin size={15} /> Vale do Paraíba
            </button>
          </div>
        </div>

        {/* Linha 2: Pílulas de Categoria Dinâmicas */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Filtro por Categoria
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap',
            paddingBottom: '8px'
          }}>
            <button
              onClick={() => setActiveCategoryTab('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '3px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                background: activeCategoryTab === 'all' ? 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)' : '#fff',
                color: activeCategoryTab === 'all' ? '#fff' : '#475569',
                boxShadow: activeCategoryTab === 'all' ? '0 4px 10px rgba(19, 15, 64, 0.15)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              📂 Ver Todas
            </button>
            {partnersData.map((cat) => {
              // Contar itens que atendem ao filtro
              const count = cat.partners.filter(p => regionFilter === 'all' || p.region === regionFilter).length;
              if (count === 0) return null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '3px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: activeCategoryTab === cat.id ? 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)' : '#fff',
                    color: activeCategoryTab === cat.id ? '#fff' : '#475569',
                    boxShadow: activeCategoryTab === cat.id ? '0 4px 10px rgba(19, 15, 64, 0.15)' : 'none',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.title}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 6px', 
                    borderRadius: '3px', 
                    background: activeCategoryTab === cat.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                    color: activeCategoryTab === cat.id ? '#fff' : '#64748b'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contador de Resultados */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 8px' }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
          Mostrando <strong style={{ color: '#130f40' }}>{totalPartnersCount}</strong> parceiros homologados.
        </p>
        {(searchTerm || activeCategoryTab !== 'all' || regionFilter !== 'all') && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveCategoryTab('all');
              setRegionFilter('all');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Listagem de Categorias e Seus Cards correspondentes */}
      {filteredData.map((category) => (
        <div key={category.id} style={{ marginBottom: '56px' }}>
          {/* Cabeçalho da Categoria com Estilo Elevado */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{category.icon}</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, color: '#130f40', margin: 0, letterSpacing: '-0.5px' }}>
                  {category.title}
                </h3>
              </div>
              <span style={{ 
                fontSize: '0.8rem', 
                color: '#64748b', 
                fontWeight: 500,
                background: '#f8fafc',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                {category.partners.filter(p => !p.isEmptySlot).length} Homologados
              </span>
            </div>
            {/* Linha Divisória em Degradê Avançado */}
            <div style={{ width: '100%', height: '3px', background: 'linear-gradient(90deg, #7ed6df 0%, #130f40 50%, rgba(126,214,223,0.05) 100%)', borderRadius: '4px' }} />
          </div>

          {/* Grid de Cards (3 colunas proporcionais preenchendo 100% do espaço) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            width: '100%'
          }}>
            {category.partners.map((partner) => (
              <div key={partner.id} style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
                {/* Card Principal */}
                <div
                  style={{
                    background: partner.isEmptySlot ? 'rgba(248, 250, 252, 0.4)' : '#ffffff',
                    border: partner.isEmptySlot ? '2px dashed rgba(126,214,223,0.5)' : '1px solid #130f40',
                    borderRadius: '3px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    boxShadow: partner.isEmptySlot ? 'none' : '0 10px 25px rgba(0,0,0,0.01)',
                    width: '100%',
                    height: '150px',
                    minHeight: '150px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    cursor: partner.isEmptySlot ? 'pointer' : 'pointer'
                  }}
                  onClick={() => {
                    if (partner.isEmptySlot) {
                      handleBecomePartner(category.title);
                    } else {
                      trackPartnerClick(partner, 'website', category.title);
                      if (partner.site) window.open(partner.site.startsWith('http') ? partner.site : `https://${partner.site}`, '_blank');
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!partner.isEmptySlot) {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(19, 15, 64, 0.08)';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    } else {
                      e.currentTarget.style.background = 'rgba(126,214,223,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(126,214,223,0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!partner.isEmptySlot) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.01)';
                      e.currentTarget.style.borderColor = '#130f40';
                    } else {
                      e.currentTarget.style.background = 'rgba(248, 250, 252, 0.4)';
                      e.currentTarget.style.borderColor = 'rgba(126,214,223,0.5)';
                    }
                  }}
                >
                  {/* Linha superior: HOMOLOGADO no canto direito */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    {!partner.isEmptySlot && (
                      <span 
                        onClick={() => {
                          trackPartnerClick(partner, 'website', category.title);
                          if (partner.site) window.open(`https://${partner.site}`, '_blank');
                        }}
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1d4ed8',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.3px'
                        }}
                      >
                        <ShieldCheck size={16} color="#1d4ed8" /> HOMOLOGADO
                      </span>
                    )}
                  </div>

                  {/* Nome do fornecedor centralizado */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, transform: 'translateY(-12px)' }}>
                    {partner.isEmptySlot ? (
                      <h4 
                        onClick={() => handleBecomePartner(category.title)}
                        style={{ 
                          fontSize: '18px', 
                          fontWeight: 600, 
                          color: '#94a3b8', 
                          margin: 0,
                          cursor: 'pointer',
                          letterSpacing: '-0.3px',
                          textAlign: 'center'
                        }}
                      >
                        + Novo Especialista
                      </h4>
                    ) : (
                      <h4 
                        onClick={() => {
                          trackPartnerClick(partner, 'website', category.title);
                          if (partner.site) window.open(`https://${partner.site}`, '_blank');
                        }}
                        style={{ 
                          fontSize: '38px', 
                          fontWeight: 400, 
                          color: '#130f40', 
                          margin: 0,
                          cursor: 'pointer',
                          letterSpacing: '-0.5px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%'
                        }}
                        title="Clique para acessar o site"
                      >
                        {partner.name}
                      </h4>
                    )}
                  </div>
                </div>

                {/* Botão Externo com 18px de distância do card principal */}
                <div style={{ width: '100%' }}>
                  {partner.isEmptySlot ? (
                    <button 
                      onClick={() => handleBecomePartner(category.title)}
                      style={{ 
                        width: '100%', 
                        height: '35px', 
                        padding: '0 8px',
                        borderRadius: '3px', 
                        border: '1px solid rgba(126,214,223,0.5)', 
                        background: 'rgba(126,214,223,0.04)',
                        color: '#130f40', 
                        fontWeight: 600,
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      title="Anuncie Sua Empresa"
                    >
                      <Sparkles size={12} color="#f97316" /> Anuncie Aqui
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        trackPartnerClick(partner, 'website', category.title);
                        if (partner.site) window.open(`https://${partner.site}`, '_blank');
                      }}
                      style={{ 
                        width: '100%', 
                        height: '35px', 
                        padding: '0 8px',
                        borderRadius: '3px', 
                        border: 'none', 
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', // Verde gradiente horizontal
                        color: '#ffffff', 
                        fontWeight: 600,
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                      }}
                      title="Acessar o Site"
                    >
                      <Globe size={12} /> Acessar Site
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredData.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px rgba(0,0,0,0.01)'
        }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#130f40', marginTop: '16px', marginBottom: '8px' }}>
            Nenhum parceiro homologado encontrado
          </h3>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '460px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
            Não encontramos parceiros que correspondam a "{searchTerm}" para a região ou categoria selecionada. Tente usar outros termos de busca.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategoryTab('all');
              setRegionFilter('all');
            }}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(19, 15, 64, 0.15)'
            }}
          >
            Limpar Filtros e Ver Todos
          </button>
        </div>
      )}
    </div>
  );
}

