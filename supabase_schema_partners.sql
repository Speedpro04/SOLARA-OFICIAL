-- ==========================================================
-- SCRIPT SQL: ESTRUTURA E CARGA DE PARCEIROS SOLARA
-- ==========================================================
-- Execute este script no SQL Editor do painel do seu Supabase.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabela de regiões (lookup) para facilitar extensões futuras
CREATE TABLE IF NOT EXISTS public.partner_regions (
    code VARCHAR(20) PRIMARY KEY
);
INSERT INTO public.partner_regions (code) VALUES ('nacional'), ('vale');

-- 1. Tabela de Cadastro dos Parceiros
CREATE TABLE IF NOT EXISTS public.solara_partners (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty TEXT NOT NULL,
    site VARCHAR(255) NOT NULL,
    region VARCHAR(20) NOT NULL REFERENCES public.partner_regions(code),
    location VARCHAR(100) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Índices para melhorar buscas
CREATE INDEX idx_partners_region ON public.solara_partners (region);
CREATE INDEX idx_partners_category ON public.solara_partners (category_id);

-- 2. Tabela de Cliques de Parceiros (Monetização)
CREATE TABLE IF NOT EXISTS public.solara_partners_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    partner_name VARCHAR(100) NOT NULL,
    category_title VARCHAR(100) NOT NULL,
    click_type VARCHAR(20) NOT NULL CHECK (click_type IN ('website', 'whatsapp')),
    clinic_id UUID,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT fk_click_partner FOREIGN KEY (partner_id) REFERENCES public.solara_partners(id)
);

-- Índices para clicks
CREATE INDEX idx_clicks_partner ON public.solara_partners_clicks (partner_id);
CREATE INDEX idx_clicks_clinic ON public.solara_partners_clicks (clinic_id);

-- Habilitar RLS em ambas
ALTER TABLE public.solara_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solara_partners_clicks ENABLE ROW LEVEL SECURITY;

-- Políticas para solara_partners (Leitura livre para carregar a página)
DROP POLICY IF EXISTS "Permitir leitura pública de parceiros" ON public.solara_partners;
CREATE POLICY "Permitir leitura pública de parceiros"
    ON public.solara_partners FOR SELECT USING (true);

-- Políticas para solara_partners_clicks
DROP POLICY IF EXISTS "Permitir inserções públicas de cliques" ON public.solara_partners_clicks;
CREATE POLICY "Permitir inserções públicas de cliques"
    ON public.solara_partners_clicks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura geral de cliques" ON public.solara_partners_clicks;
CREATE POLICY "Permitir leitura geral de cliques"
    ON public.solara_partners_clicks FOR SELECT USING (true);

-- Carga inicial de todos os 94 parceiros comerciais homologados
INSERT INTO public.solara_partners (id, name, specialty, site, region, location, category_id)
VALUES
('eo-1', 'Gnatus', 'Líder nacional em consultórios, scanners 3D e periféricos de alta performance.', 'gnatus.com.br', 'nacional', 'Ribeirão Preto / BR', 'equip-odonto'),
('eo-2', 'Olsen', 'Equipamentos odontológicos e médicos premium focados em ergonomia e durabilidade.', 'olsen.odo.br', 'nacional', 'Santa Catarina', 'equip-odonto'),
('eo-3', 'Xdent', 'Fabricação e assistência técnica especializada em equipamentos odontológicos robustos.', 'xdent.com.br', 'nacional', 'São Paulo', 'equip-odonto'),
('eo-4', 'Dental Odonto', 'Uma das maiores e-commerces odontológicos com ampla gama de equipamentos e suporte.', 'dentalodonto.com.br', 'nacional', 'Brasil', 'equip-odonto'),
('eo-5', 'Dabi Atlante', 'Marca histórica do grupo Alliage, líder em cadeiras e conjuntos clínicos avançados.', 'dabiatlante.com.br', 'nacional', 'Ribeirão Preto / BR', 'equip-odonto'),
('eo-6', 'Saevo', 'Marca forte do ecossistema Alliage com foco estrito em custo-benefício e ergonomia.', 'saevo.com.br', 'nacional', 'Ribeirão Preto / BR', 'equip-odonto'),
('eo-7', 'Kavo', 'Fabricante multinacional com planta no Brasil, focada em equipamentos e peças de alta performance.', 'kavo.com.br', 'nacional', 'Joinville / BR', 'equip-odonto'),
('eo-8', 'Woson', 'Equipamentos clínicos com foco estrito em biossegurança e automação inteligente de consultórios.', 'wosonlatam.com.br', 'nacional', 'Brasil', 'equip-odonto'),
('di-1', 'Gnatus Imagem', 'Sistemas avançados de Raio-X panorâmico, sensores digitais e scanners intraorais.', 'gnatus.com.br', 'nacional', 'Ribeirão Preto / BR', 'diag-imagem'),
('di-2', 'Dental Speed', 'Portfólio completo de Raio-X e sensores Gnatus, D700 e Micro Imagem com entrega rápida.', 'dentalspeed.com', 'nacional', 'Brasil', 'diag-imagem'),
('di-3', 'Dental Cremer', 'Soluções completas em radiologia digital, sensores e softwares de imagem integrada.', 'dentalcremer.com.br', 'nacional', 'Brasil', 'diag-imagem'),
('di-4', 'RaioX Prox', 'Especialista em aparelhos de Raio-X odontológicos portáteis e fixos de alta fidelidade.', 'raioxprox.com.br', 'nacional', 'São Paulo', 'diag-imagem'),
('di-5', 'BCMED', 'Equipamentos de ultrassom terapêutico e diagnóstico de alto padrão para clínicas.', 'bcmed.com.br', 'nacional', 'Brasil', 'diag-imagem'),
('di-6', 'GE HealthCare', 'Gigante global de tecnologia em ultrassom e equipamentos pesados de diagnóstico clínico.', 'gehealthcare.com.br', 'nacional', 'Global / BR', 'diag-imagem'),
('di-7', 'Siemens Healthineers', 'Líder de mercado em sistemas de imagem médica de alta fidelidade e software integrados.', 'siemens-healthineers.com/br', 'nacional', 'Global / BR', 'diag-imagem'),
('di-8', 'Mindray Brasil', 'Excelente relação custo-benefício em sistemas portáteis e fixos de ultrassom clínico.', 'mindray.com/br', 'nacional', 'Global / BR', 'diag-imagem'),
('di-9', 'Dabi Atlante Imagem', 'Braço de radiologia digital e tomógrafos odontológicos de alta precisão.', 'dabiatlante.com.br', 'nacional', 'Brasil', 'diag-imagem'),
('di-10', 'Vatech Brasil', 'Multinacional líder em radiologia odontológica digital, sensores e Raio-X panorâmico.', 'vatechbr.com.br', 'nacional', 'Global / BR', 'diag-imagem'),
('di-11', 'Preliê X-Ray', 'Fabricante focada em aparelhos de Raio-X analógicos e digitais compactos para consultórios.', 'prelie.com.br', 'nacional', 'Brasil', 'diag-imagem'),
('un-1', 'Preven', 'Especialista em materiais descartáveis, babadores, máscaras e EPIs odontológicos.', 'preven.com.br', 'nacional', 'Brasil', 'uniformes'),
('un-2', 'Medix Brasil', 'Fabricação e importação de descartáveis e EPIs hospitalares com alto padrão de qualidade.', 'medixbrasil.com.br', 'nacional', 'Brasil', 'uniformes'),
('un-3', 'Cremer', 'Fornecedora massiva de algodão, gases, luvas, máscaras e descartáveis cirúrgicos.', 'cremer.com.br', 'nacional', 'Blumenau / BR', 'uniformes'),
('un-4', 'Camlab', 'Confecção de jalecos clínicos e uniformes profissionais modernos e funcionais.', 'camlab.com.br', 'nacional', 'Brasil', 'uniformes'),
('un-5', 'Hospdent', 'Distribuição de descartáveis clínicos e suprimentos odontológicos de giro diário.', 'hospdent.com.br', 'nacional', 'Brasil', 'uniformes'),
('un-6', 'Cirúrgica Fernandes', 'Uma das maiores distribuidoras de correlatos, curativos e descartáveis médicos do país.', 'cirurgicafernandes.com.br', 'nacional', 'São Paulo', 'uniformes'),
('un-7', 'MA Hospitalar', 'Distribuidora de grande porte que atende do insumo básico ao equipamento de proteção.', 'mahospitalar.com.br', 'nacional', 'Brasil', 'uniformes'),
('un-8', 'Dufarma', 'Canal logístico rápido e especializado para suprimentos e descartáveis médicos de alto giro.', 'dufarma.com.br', 'nacional', 'Minas Gerais', 'uniformes'),
('un-9', 'Cherie (Dra. Cherie)', 'Referência nacional em jalecos e uniformes premium de alta costura para clínicas.', 'dracherie.com.br', 'nacional', 'São Paulo / BR', 'uniformes'),
('un-10', 'Uniformes Profissionais', 'Confecção em escala industrial de uniformes corporativos, higiênicos e clínicos sob demanda.', 'uniformesprofissionais.com.br', 'nacional', 'Brasil', 'uniformes'),
('re-1', 'Corpus Saneamento', 'Uma das maiores da América Latina no gerenciamento e descarte legal de lixo hospitalar.', 'corpus.com.br', 'nacional', 'América Latina / BR', 'residuos'),
('re-2', 'Mig Lix', 'Especialista em transporte, incineração e destinação segura de resíduos de saúde no estado de SP.', 'miglix.com.br', 'nacional', 'São Paulo', 'residuos'),
('re-3', 'Loga (Logística Ambiental de SP)', 'Concessionária oficial responsável pela gestão de resíduos de saúde de grandes áreas da capital.', 'loga.com.br', 'nacional', 'São Paulo', 'residuos'),
('re-4', 'Ecourbis Ambiental', 'Atendimento corporativo de coleta hospitalar, tratamento e destinação final homologada.', 'ecourbis.com.br', 'nacional', 'São Paulo', 'residuos'),
('re-5', 'Resiforte', 'Gerenciamento total de resíduos biológicos perigosos específicos para clínicas e consultórios.', 'resiforte.com.br', 'nacional', 'Brasil', 'residuos'),
('re-6', 'Sustentare Saneamento', 'Infraestrutura robusta urbana e privada para coleta e tratamento de resíduos de saúde.', 'sustentaresaneamento.com.br', 'nacional', 'Brasil', 'residuos'),
('rv-1', 'Cirúrgica Vale do Paraíba', 'Distribuidora tradicional na região para descartáveis, insumos clínicos e correlatos médicos.', 'cirurgicavaledoparaiba.com.br', 'vale', 'Taubaté', 'regional-vale'),
('rv-2', 'Cirúrgica São José', 'Forte atendimento regional em materiais cirúrgicos, descartáveis e equipamentos de reabilitação.', 'cirurgicasaojose.com.br', 'vale', 'São José dos Campos', 'regional-vale'),
('rv-3', 'Dental Vale', 'Distribuidora focada em insumos odontológicos com entrega rápida para todas as cidades do Vale.', 'dentalvale.com.br', 'vale', 'São José dos Campos', 'regional-vale'),
('rv-4', 'Medical Vale', 'Representação e comércio de produtos médicos, hospitalares e mobiliário clínico na região.', 'medicalvale.com.br', 'vale', 'Pindamonhangaba / Taubaté', 'regional-vale'),
('rv-5', 'Macro Vale Hospitalar', 'Fornecedora de materiais médicos de consumo, descartáveis e saneantes para clínicas do Vale.', 'macrovalehospitalar.com.br', 'vale', 'São José dos Campos', 'regional-vale'),
('rv-6', 'Vale Resíduos', 'Coleta, transporte e descarte legal de resíduos de saúde (Grupo A) atendendo clínicas de todo o Vale.', 'valeresiduos.com.br', 'vale', 'Jacareí / SJC', 'regional-vale'),
('rv-7', 'Cirúrgica Pasin', 'Tradicional fornecedora local de descartáveis, materiais hospitalares e mobiliário para consultórios.', 'cirurgicapasin.com.br', 'vale', 'Pindamonhangaba', 'regional-vale'),
('rv-8', 'Dental OdontoVale', 'Distribuidora regional focada no atendimento de alta velocidade a dentistas e clínicas odontológicas.', 'dentalodontovale.com.br', 'vale', 'Taubaté', 'regional-vale'),
('rv-9', 'Biosaneamento / Serquip', 'Empresa especializada na coleta, tratamento e incineração de resíduos de saúde com forte rota nas clínicas do Vale.', 'serquip.com.br', 'vale', 'Vale do Paraíba', 'regional-vale'),
('rv-10', 'Vale Med', 'Distribuidora regional de produtos para saúde, materiais de consumo e correlatos médicos.', 'valemed.com.br', 'vale', 'São José dos Campos', 'regional-vale'),
('rv-11', 'Representação Olsen/Dabi Vale', 'Escritórios técnicos locais e representantes autorizados das grandes marcas para venda e assistência técnica.', 'dabivale.com.br', 'vale', 'São José dos Campos', 'regional-vale'),
('rv-12', 'Gases Jacareí / Oxigênio Vale', 'Fornecimento local de cilindros de oxigênio medicinal e gases comprimidos certificados para clínicas.', 'oxigeniovale.com.br', 'vale', 'Jacareí', 'regional-vale'),
('rv-13', 'Grupo Suprimed', 'Gigante regional, distribuidor Master oficial da Mindray (referência em ultrassons de alta resolução fixos e portáteis).', 'suprimed.com.br', 'vale', 'São José dos Campos', 'regional-vale'),
('rv-14', 'D. Gonçalves Instrumentos / Alliage', 'Engenharia clínica e representante técnico autorizado de imagem do grupo Alliage (Dabi/Saevo) para Raio-X e tomógrafos.', 'dgoncalves.com.br', 'vale', 'São José dos Campos', 'regional-vale'),
('rv-15', 'Medsul Diagnóstica', 'Distribuidora master que atende o eixo do Vale com equipamentos pesados de imagem e ultrassons avançados.', 'medsuldiagnostica.com.br', 'vale', 'Atendimento Vale', 'regional-vale'),
('rv-16', 'GE HealthCare SP', 'Concessionária de vendas direta para o interior paulista, especializada nos ultrassons das linhas Voluson e Logiq.', 'gehealthcare.com.br', 'vale', 'Interior SP / SJC', 'regional-vale'),
('rv-17', 'Canon Medical Systems', 'Fornecimento direto e suporte de sistemas de ultrassom e Raio-X digital de altíssimo padrão para clínicas do Vale.', 'br.medical.canon', 'vale', 'Vale do Paraíba', 'regional-vale'),
('rv-18', 'Konica Minolta Healthcare', 'Focada na digitalização de imagem, fornecendo placas de Raio-X digital (CR/DR) e ultrassons compactos.', 'konicaminolta.com.br/healthcare', 'vale', 'Distribuição Vale', 'regional-vale'),
('fi-1', 'Ibramed', 'Referência nacional em ultrassom terapêutico, estimulação, laser e termoterapia profissional.', 'ibramed.com.br', 'nacional', 'Amparo / SP', 'fisioterapia'),
('fi-2', 'BCMED', 'Distribuição completa de aparelhos de eletroterapia, fototerapia, pilates e reabilitação física.', 'bcmed.com.br', 'nacional', 'Brasil', 'fisioterapia'),
('fi-3', 'Hospimetal', 'Fabricante de macas, divãs, mesas e mobiliários hospitalares metálicos de alta resistência.', 'hospimetal.com.br', 'nacional', 'São Paulo', 'fisioterapia'),
('fi-4', 'Shopfisio / Grupo Ergolife', 'O maior ecossistema do país com logística expressa para o Vale, distribuindo equipamentos pesados Ibramed.', 'shopfisio.com.br', 'vale', 'Eixo Dutra / Vale', 'fisioterapia'),
('fi-5', 'I9 Med / Representação KLD', 'Distribuidor e assistência autorizada das tecnologias de laser de alta potência e ondas de choque KLD.', 'i9med.com.br', 'vale', 'Atendimento Vale', 'fisioterapia'),
('fi-6', 'Carci Reabilitação', 'Principal fabricante nacional de termoterapia, mecanoterapia e robótica com atendimento corporativo direto no Vale.', 'carci.com.br', 'vale', 'Vale / SP', 'fisioterapia'),
('fi-7', 'Fisio Fernandes', 'Distribuidora focada em pacotes completos de clínicas de fisioterapia (turbilhões, ultrassom e estúdios de Pilates).', 'fisiofernandes.com.br', 'vale', 'Logística Vale', 'fisioterapia'),
('fi-8', 'Mediteq', 'Fornecedora de tecnologia médica pesada para reabilitação cardiopulmonar e engenharia clínica avançada.', 'mediteq.com.br', 'nacional', 'Brasil', 'fisioterapia'),
('fi-9', 'NeuroUp / TechFisio', 'Representação e soluções voltadas para biofeedback clínico e reabilitação neurológica digital.', 'neuroup.com.br', 'nacional', 'Brasil', 'fisioterapia'),
('en-1', 'Fujifilm Healthcare Brasil', 'Líder global em torres de endoscopia/colonoscopia com tecnologia Eluxeo e inteligência artificial.', 'fujifilm.com/br/pt', 'vale', 'Canal Vale / SP', 'endoscopia'),
('en-2', 'Olympus Medical', 'Padrão ouro de mercado em endoscópios flexíveis, videoprocessadoras e sistemas de imagem cirúrgica.', 'olympus.com.br', 'vale', 'Atendimento Vale / SP', 'endoscopia'),
('en-3', 'Pentax Medical / H.Strattner', 'Distribuidora oficial Pentax no Brasil com equipamentos de alta definição e engenharia local.', 'strattner.com.br', 'vale', 'Eixo Dutra / SP', 'endoscopia'),
('en-4', 'Karl Storz Endoscopia', 'Referência alemã absoluta em endoscopia rígida e flexível, óticas cirúrgicas de alta performance.', 'karlstorz.com', 'nacional', 'São Paulo', 'endoscopia'),
('en-5', 'Huger Endoscopia / Meditron', 'Torres de vídeo endoscopia digital e insumos periféricos com excelente relação custo-benefício.', 'meditron.com.br', 'vale', 'Distribuição Regional', 'endoscopia'),
('en-6', 'Aohua Endoscopia / Endomed', 'Distribuidora focada em sistemas de videoendoscopia flexível com manutenção ágil regional.', 'endomed.com.br', 'vale', 'Interior Paulista', 'endoscopia'),
('io-1', 'Dental Speed', 'Distribuidora autorizada FGM, Dentsply, Ultradent e centenas de outras marcas com frete expresso.', 'dentalspeed.com', 'nacional', 'Brasil', 'insumos-odonto'),
('io-2', 'Dental Cremer', 'Líder nacional na distribuição de insumos, resinas e descartáveis odontológicos de alta qualidade.', 'dentalcremer.com.br', 'nacional', 'Brasil', 'insumos-odonto'),
('io-3', 'Dental Focus', 'Prótese dentária, materiais de moldagem, cerâmicas e gessos com foco no estado de SP.', 'dentalfocus.com.br', 'nacional', 'Santo André / SP', 'insumos-odonto'),
('io-4', 'Dental Ita', 'Especialista em suprimentos clínicos e laboratoriais para prótese e reabilitação oral.', 'dentalita.com.br', 'nacional', 'São Paulo', 'insumos-odonto'),
('es-1', 'Ibramed', 'Líder nacional em equipamentos de alta tecnologia estética, Criolipólise e Sonopulse.', 'ibramed.com.br', 'nacional', 'Amparo / SP', 'equip-estetica'),
('es-2', 'BCMED', 'Cavitação, radiofrequência, eletroterapia, lasers de depilação e dermocosméticos com entrega imediata.', 'bcmed.com.br', 'nacional', 'Brasil', 'equip-estetica'),
('es-3', 'Body Health Brasil', 'Equipamentos estéticos corporais de ponta, tecnologia HImFU e Criofrequência patenteada.', 'bodyhealthbrasil.com', 'nacional', 'Brasil', 'equip-estetica'),
('es-4', 'Casa da Estética', 'Distribuidor consolidado com mais de 26 anos de mercado em aparelhos e descartáveis estéticos.', 'casadaestetica.com.br', 'nacional', 'São Paulo', 'equip-estetica'),
('mo-1', 'Lafaiete', 'Projetos sob medida e móveis de altíssimo padrão para consultórios com 59 anos de tradição.', 'lafaiete.com.br', 'nacional', 'São Paulo', 'mobiliario'),
('mo-2', 'Casa Médica', 'Ampla variedade de macas de exames, biombos, cadeiras de coleta e escadinhas hospitalares.', 'casamedica.com.br', 'nacional', 'Brasil', 'mobiliario'),
('mo-3', 'Odonto Equipamentos', 'Mobiliário integrado, armários modulares e acessórios ergonômicos para clínicas de saúde.', 'odontoequipamentos.com.br', 'nacional', 'São Paulo', 'mobiliario'),
('la-1', 'Dentsply Sirona', 'Tecnologia CAD-CAM odontológica líder, blocos cerâmicos, fornos e fresadoras digitais.', 'dentsplysirona.com/br', 'nacional', 'Global / BR', 'laboratorio'),
('la-2', 'Schuster', 'Equipamentos de suporte para laboratórios de prótese, compressores isentos de óleo e bombas.', 'schuster.com.br', 'nacional', 'Rio Grande do Sul', 'laboratorio'),
('la-3', 'FGM Dental Group', 'Fabricação de biomateriais, pinos de fibra de vidro de alta resistência e clareadores consagrados.', 'fgm.ind.br', 'nacional', 'Joinville / BR', 'laboratorio'),
('la-4', 'Dental Focus', 'Portfólio de fornos de sinterização, motores de bancada e insumos laboratoriais avançados.', 'dentalfocus.com.br', 'nacional', 'São Paulo', 'laboratorio'),
('la-5', 'AllPrime', 'Materiais odontológicos e insumos de laboratório focados em alto rendimento e economia.', 'allprime.com.br', 'nacional', 'Brasil', 'laboratorio'),
('se-1', 'Porto Seguro Saúde', 'Seguro de equipamentos médicos caros, planos de saúde coletivos e responsabilidade civil profissional.', 'portoseguro.com.br', 'nacional', 'Brasil', 'seguros'),
('se-2', 'Bradesco Saúde', 'Plano corporativo e de saúde de alta fidelidade estruturado sob medida para equipes de clínicas.', 'bradescooperadorasdesaude.com.br', 'nacional', 'Brasil', 'seguros'),
('se-3', 'SulAmérica', 'Responsabilidade Civil Profissional para médicos/dentistas e proteção patrimonial de clínicas.', 'sulamerica.com.br', 'nacional', 'Brasil', 'seguros'),
('se-4', 'Allianz Saúde', 'Garantias extensas contra quebra de equipamentos de diagnóstico e processos de responsabilidade civil.', 'allianz.com.br', 'nacional', 'Global / BR', 'seguros'),
('se-5', 'Zurich Seguros', 'Proteção sob medida para roubos e danos elétricos em equipamentos pesados de reabilitação e imagem.', 'zurich.com.br', 'nacional', 'Global / BR', 'seguros'),
('fn-1', 'Santander Financiamentos', 'Linhas específicas de leasing e financiamento para aquisição ágil de tecnologia em saúde.', 'santander.com.br', 'nacional', 'Brasil', 'financiamentos'),
('fn-2', 'BNDES Finame', 'Financiamento de longo prazo com taxas especiais para compra de maquinário de saúde de fabricação nacional.', 'bndes.gov.br', 'nacional', 'Brasil', 'financiamentos'),
('fn-3', 'Sicoob Saúde', 'Cooperativa de crédito com taxas de juros reduzidas e suporte financeiro direcionado a médicos e dentistas.', 'sicoob.com.br', 'nacional', 'Brasil', 'financiamentos'),
('fn-4', 'BV Financeira', 'Soluções rápidas de capital de giro e financiamento de aparelhos eletromédicos sem burocracia.', 'bv.com.br', 'nacional', 'Brasil', 'financiamentos'),
('fn-5', 'CrediMédico', 'Financiamento customizado e assessoria especializada para montagem completa de novas clínicas.', 'credimedico.com.br', 'nacional', 'Brasil', 'financiamentos');
