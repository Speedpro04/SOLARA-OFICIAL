import { useState, useMemo, useEffect } from 'react';
import { Globe, ShieldCheck, Crown, Search, MapPin, Sparkles, Filter } from 'lucide-react';
import { supabase } from './lib/supabase';
import { partnersDataStatic } from './lib/partnersDataStatic';

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

interface PartnersPageProps {
  clinicId?: string;
}

export default function PartnersPage({ clinicId }: PartnersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [regionFilter, setRegionFilter] = useState<'all' | 'nacional' | 'vale'>('all');
  const [partnersList, setPartnersList] = useState<Partner[]>([]);

  useEffect(() => {
    setPartnersList(partnersDataStatic);
  }, []);

  const partnersData = useMemo(() => {
    return categoriesList.map(cat => {
      const catPartners = partnersList.filter(p => p.category_id === cat.id);
      return {
        ...cat,
        partners: [
          ...catPartners,
          generateEmptySlot(`${cat.id}-empty`, cat.title, cat.id === 'regional-vale' ? 'vale' : 'nacional')
        ]
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
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(19, 15, 64, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={36} color="#7ed6df" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#130f40', letterSpacing: '-1px' }}>
                Partnership Premium
              </h2>
              <span style={{ 
                background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)', 
                color: '#fff', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '4px 10px', 
                borderRadius: '9999px',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
                letterSpacing: '0.5px'
              }}>
                EXCLUSIVO
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '6px', margin: 0, fontWeight: 500 }}>
              O maior hub homologado de suprimentos, equipamentos de ponta e resíduos para sua clínica médica ou odontológica.
            </p>
          </div>
        </div>
      </div>

      {/* Controles de Busca e Filtros Dinâmicos (Painel Premium) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '16px',
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
                borderRadius: '10px', 
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
            borderRadius: '10px', 
            border: '1px solid #e2e8f0' 
          }}>
            <button 
              onClick={() => setRegionFilter('all')}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
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
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
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
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
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
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Filtro por Categoria
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '8px',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'thin'
          }}>
            <button
              onClick={() => setActiveCategoryTab('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                fontWeight: 600,
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
                    borderRadius: '9999px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.85rem',
                    fontWeight: 600,
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
                    borderRadius: '9999px', 
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
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#130f40', margin: 0, letterSpacing: '-0.5px' }}>
                  {category.title}
                </h3>
              </div>
              <span style={{ 
                fontSize: '0.8rem', 
                color: '#64748b', 
                fontWeight: 600,
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

          {/* Grid de Cards Responsivo (3 colunas com gap de 24px) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
            gap: '24px' 
          }}>
            {category.partners.map((partner) => (
              <div
                key={partner.id}
                style={{
                  background: partner.isEmptySlot ? 'rgba(248, 250, 252, 0.4)' : '#ffffff',
                  border: partner.isEmptySlot ? '2px dashed rgba(126,214,223,0.5)' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  boxShadow: partner.isEmptySlot ? 'none' : '0 10px 25px rgba(0,0,0,0.01)',
                  height: '100%',
                  minHeight: '220px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!partner.isEmptySlot) {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 30px rgba(19, 15, 64, 0.06)';
                    e.currentTarget.style.borderColor = '#7ed6df';
                  } else {
                    e.currentTarget.style.background = 'rgba(126,214,223,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(126,214,223,0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!partner.isEmptySlot) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.01)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  } else {
                    e.currentTarget.style.background = 'rgba(248, 250, 252, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(126,214,223,0.5)';
                  }
                }}
              >
                {/* Badge de Homologação / Região */}
                {!partner.isEmptySlot ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    {/* Badge de Cobertura Regional vs Nacional */}
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: partner.region === 'vale' ? '#eff6ff' : '#f0fdf4',
                      color: partner.region === 'vale' ? '#1d4ed8' : '#15803d',
                      border: partner.region === 'vale' ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {partner.region === 'vale' ? <MapPin size={10} /> : <Globe size={10} />}
                      {partner.region === 'vale' ? 'Região Vale' : 'Nacional'}
                    </span>

                    {/* Selo Homologado Premium */}
                    <span style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      letterSpacing: '0.5px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      background: 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      boxShadow: '0 4px 10px rgba(19, 15, 64, 0.15)'
                    }}>
                      <ShieldCheck size={12} color="#7ed6df" /> HOMOLOGADO
                    </span>
                  </div>
                ) : (
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1'
                    }}>
                      DISPONÍVEL
                    </span>
                  </div>
                )}

                {/* Nome do Parceiro */}
                <h4 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  color: partner.isEmptySlot ? '#94a3b8' : '#130f40', 
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px'
                }}>
                  {partner.name}
                </h4>

                {/* Descrição / Especialidade */}
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: partner.isEmptySlot ? '#64748b' : '#475569', 
                  lineHeight: '1.5',
                  margin: '0 0 16px 0',
                  flex: 1
                }}>
                  {partner.specialty}
                </p>

                {/* Tag de Localização */}
                {!partner.isEmptySlot && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    color: '#64748b', 
                    fontSize: '0.8rem', 
                    fontWeight: 500,
                    marginBottom: '20px'
                  }}>
                    <MapPin size={12} />
                    <span>{partner.location}</span>
                  </div>
                )}

                {/* Linha Divisória antes dos botões */}
                <div style={{ height: '1px', background: '#f1f5f9', width: '100%', marginBottom: '16px' }} />

                {/* Botões e Links de Ação */}
                <div style={{ marginTop: 'auto' }}>
                  {partner.isEmptySlot ? (
                    <button 
                      onClick={() => handleBecomePartner(category.title)}
                      style={{ 
                        width: '100%', 
                        padding: '11px', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(126,214,223,0.5)', 
                        background: 'rgba(126,214,223,0.04)',
                        color: '#130f40', 
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(126,214,223,0.12)';
                        e.currentTarget.style.borderColor = '#7ed6df';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(126,214,223,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(126,214,223,0.5)';
                      }}
                    >
                      <Sparkles size={14} color="#f97316" /> Anuncie Sua Empresa
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {/* Botão Principal de Redirecionamento para Site */}
                      <button 
                        onClick={() => {
                          trackPartnerClick(partner, 'website', category.title);
                          window.open(`https://${partner.site}`, '_blank');
                        }}
                        style={{ 
                          flex: 1,
                          padding: '11px 16px', 
                          borderRadius: '8px', 
                          border: 'none', 
                          background: 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)', 
                          color: '#ffffff', 
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(19, 15, 64, 0.1)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(19, 15, 64, 0.15)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #1d1959 0%, #364e66 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(19, 15, 64, 0.1)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #130f40 0%, #2c3e50 100%)';
                        }}
                      >
                        <Globe size={15} /> Acesse o Site
                      </button>

                      {/* Botão de WhatsApp Rápido (Homologados) */}
                      <button
                        onClick={() => {
                          trackPartnerClick(partner, 'whatsapp', category.title);
                          const text = encodeURIComponent(`Olá! Vi sua empresa no portal Solara Connect e gostaria de falar com o atendimento comercial sobre suprimentos/serviços.`);
                          window.open(`https://wa.me/5512997184000?text=${text}`, '_blank');
                        }}
                        title="Atendimento Rápido WhatsApp"
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          width: '40px',
                          height: '38px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#dcfce7';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#f0fdf4';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#16a34a">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.875 1.218 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                        </svg>
                      </button>
                    </div>
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

