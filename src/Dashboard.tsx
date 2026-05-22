import { useState } from 'react';
import { Home, Ship, Anchor, FileText, Users, Bell, LogOut, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { YachtChecklist } from './YachtChecklist';
import './yachts.css';

interface DashboardProps {
  onLogout: () => void;
  clinicId?: string;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  // Cores Base do Yacht's Atlas
  const colors = {
    sidebarBg: '#030816', // Darkest blue
    mainBg: '#050D1C',    // Dark blue
    cardBg: '#09152B',    // Slightly lighter blue for cards
    gold: '#D4AF37',      // Primary Gold
    goldHover: '#E8CA58',
    textMain: '#F5F5F5',
    textMuted: '#8B9BB4',
    border: 'rgba(212, 175, 55, 0.15)'
  };

  const menuItems = [
    { id: 'home', icon: <Home size={22} /> },
    { id: 'assets', icon: <Ship size={22} /> },
    { id: 'checklist', icon: <Anchor size={22} /> },
    { id: 'vault', icon: <FileText size={22} /> },
    { id: 'partners', icon: <Users size={22} /> }
  ];

  // ==========================================
  // VIEW: HOME (Painel Inicial)
  // ==========================================
  const renderHome = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="yacht-container">
      <h4 style={{ color: colors.gold, letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: `1px solid ${colors.gold}`, display: 'inline-block', paddingBottom: '0.5rem' }}>
        SEGURANÇA PESSOAL
      </h4>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', color: colors.textMain, lineHeight: '1.1', marginBottom: '1.5rem' }}>
        Marina Hub <br />
        <span style={{ color: colors.gold, fontStyle: 'italic' }}>Fleet Excellence</span>
      </h1>
      <p style={{ color: colors.textMuted, fontSize: '1.1rem', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
        Plataforma de custódia digital para gestão de ativos marítimos de alto valor, com auditoria e rastreabilidade documental em tempo real.
      </p>
      
      <button style={{ background: `linear-gradient(135deg, ${colors.gold}, #997A00)`, border: 'none', color: '#000', padding: '12px 24px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase' }}>
        + ADICIONAR ATIVO
      </button>

      <div style={{ marginTop: '5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.textMain, fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '2rem' }}>
          <Anchor color={colors.gold} size={28} /> Seus Ativos
        </h3>
        
        {/* Empty State visual */}
        <div style={{ border: `1px dashed ${colors.border}`, borderRadius: '8px', padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <p style={{ color: colors.textMuted }}>Nenhum ativo registrado recentemente.</p>
        </div>
      </div>
    </motion.div>
  );

  // ==========================================
  // VIEW: ASSETS (Ativos)
  // ==========================================
  const renderAssets = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="yacht-container">
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
         <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: colors.textMain, display: 'flex', alignItems: 'center', gap: '15px' }}>
           <Ship color={colors.gold} size={32} /> Ativos
         </h1>
         <button style={{ background: `linear-gradient(135deg, ${colors.gold}, #997A00)`, border: 'none', color: '#000', padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase' }}>
           + NOVO ATIVO
         </button>
       </div>

       {/* Search Bar */}
       <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
         <div style={{ flex: 1, position: 'relative' }}>
           <Search size={18} color={colors.textMuted} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }} />
           <input type="text" placeholder="Buscar embarcação por nome, fabricante ou ID..." style={{ width: '100%', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, color: colors.textMain, padding: '12px 15px 12px 45px', borderRadius: '6px', outline: 'none' }} />
         </div>
         <button style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textMuted, padding: '0 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <Filter size={16} /> FILTRAR
         </button>
       </div>

       {/* List Header */}
       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 0.5fr', padding: '10px 20px', color: colors.textMuted, fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: `1px solid ${colors.border}` }}>
         <div>Embarcação</div>
         <div>Especificações</div>
         <div>Categoria</div>
         <div>Conformidade</div>
         <div>Ações</div>
       </div>

       {/* List Items Mock */}
       {[
         { name: 'Azimut Grande Trideck', id: '#A9832C', type: 'IATE', year: '2023', cat: 'SUPERYACHT', conf: 100 },
         { name: 'Ferretti Yachts 780', id: '#B46519', type: 'IATE', year: '2021', cat: 'EXECUTIVE', conf: 85 },
         { name: 'Focker 450 Gran Coupe', id: '#F708H9', type: 'LANCHA', year: '2020', cat: 'COMPACT', conf: 45 }
       ].map((item, idx) => (
         <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 0.5fr', alignItems: 'center', padding: '20px', borderBottom: `1px solid rgba(255,255,255,0.03)`, transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ width: 48, height: 48, borderRadius: '8px', border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.sidebarBg }}>
               <Ship size={20} color={colors.gold} />
             </div>
             <div>
               <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: colors.textMain }}>{item.name}</div>
               <div style={{ fontSize: '0.75rem', color: colors.textMuted, letterSpacing: '1px' }}>ID: {item.id}</div>
             </div>
           </div>
           <div>
             <div style={{ fontSize: '0.8rem', color: colors.textMain, letterSpacing: '1px' }}>{item.type}</div>
             <div style={{ fontSize: '0.7rem', color: colors.textMuted, letterSpacing: '1px' }}>FABRICADO EM {item.year}</div>
           </div>
           <div>
             <span style={{ padding: '4px 10px', fontSize: '0.7rem', letterSpacing: '1px', backgroundColor: item.cat === 'SUPERYACHT' ? colors.gold : (item.cat === 'EXECUTIVE' ? '#fff' : '#333'), color: item.cat === 'SUPERYACHT' || item.cat === 'EXECUTIVE' ? '#000' : '#fff', fontWeight: 600, borderRadius: '2px' }}>{item.cat}</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <div style={{ width: '80%', height: '4px', backgroundColor: '#222', borderRadius: '2px', overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${item.conf}%`, backgroundColor: colors.gold }} />
             </div>
             <span style={{ fontSize: '0.8rem', color: colors.textMuted }}>{item.conf}%</span>
           </div>
           <div style={{ display: 'flex', gap: '10px' }}>
             <button style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textMuted, width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'>'}</button>
           </div>
         </div>
       ))}
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.mainBg, fontFamily: "'Inter', sans-serif" }}>
      
      {/* ========================================== */}
      {/* SIDEBAR NAVEGAÇÃO (Ícones)                 */}
      {/* ========================================== */}
      <div style={{ width: '80px', backgroundColor: colors.sidebarBg, display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 101, borderRight: `1px solid rgba(255,255,255,0.05)` }}>
        
        {/* Logo Area */}
        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
          <div style={{ color: colors.gold, fontFamily: "'Playfair Display', serif", fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', lineHeight: 1 }}>
            ATLAS<br/><span style={{ fontSize: '0.5rem', letterSpacing: '2px', color: colors.textMuted }}>YACHTS</span>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginTop: '2rem', flex: 1 }}>
          {menuItems.map(item => (
            <div key={item.id} style={{ position: 'relative', width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Indicador Ativo */}
              {activeTab === item.id && (
                <motion.div layoutId="sidebar-active" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '30px', backgroundColor: colors.gold, boxShadow: `0 0 10px ${colors.gold}` }} />
              )}
              
              <button 
                onClick={() => setActiveTab(item.id)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeTab === item.id ? colors.gold : colors.textMuted, transition: 'color 0.3s', padding: '15px' }}
                title={item.id.toUpperCase()}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{ paddingBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <button style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer' }} title="Notificações">
            <Bell size={20} />
          </button>
          <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer' }} title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* MAIN CONTENT AREA                          */}
      {/* ========================================== */}
      <div style={{ marginLeft: '80px', flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ height: '80px', borderBottom: `1px solid rgba(255,255,255,0.05)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', backgroundColor: colors.mainBg, position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ color: colors.textMuted, fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '15px' }}>
             <span style={{ color: colors.gold }}>●</span> SYSTEM PROTOCOL 
             <span style={{ color: colors.gold }}>●</span> {activeTab === 'home' ? 'PAINEL DE CONTROLE' : (activeTab === 'checklist' ? 'INSPEÇÃO TÉCNICA' : activeTab.toUpperCase())}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: colors.textMain, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>YACHT MASTER</div>
              <div style={{ color: colors.gold, fontSize: '0.65rem', letterSpacing: '1px' }}>PREMIUM VAULT ACCESS</div>
            </div>
            <div style={{ width: 40, height: 40, backgroundColor: colors.gold, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontFamily: "'Playfair Display', serif" }}>
              YM
            </div>
          </div>
        </header>

        {/* Content Views */}
        <div style={{ padding: '40px' }}>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'assets' && renderAssets()}
          {activeTab === 'checklist' && <YachtChecklist />}
          {activeTab === 'vault' && (
             <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
               <FileText size={64} color={colors.gold} style={{ opacity: 0.5, marginBottom: '20px' }} />
               <h2 style={{ fontFamily: "'Playfair Display', serif", color: colors.textMain, fontSize: '2rem' }}>Digital Vault</h2>
               <p style={{ color: colors.textMuted }}>Acesso restrito e criptografado aos dossiês marítimos.</p>
             </div>
          )}
          {activeTab === 'partners' && (
             <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
               <Users size={64} color={colors.gold} style={{ opacity: 0.5, marginBottom: '20px' }} />
               <h2 style={{ fontFamily: "'Playfair Display', serif", color: colors.textMain, fontSize: '2rem' }}>Parceiros Credenciados</h2>
               <p style={{ color: colors.textMuted }}>Gestão de Brokers, Seguradoras e Auditores Externos.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
