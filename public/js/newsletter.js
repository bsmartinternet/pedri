/* newsletter.js - PEDRI - Sistema de nichos tematicos */
'use strict';

const NICHES = {
  'email-marketing': {
    label: 'Email Marketing',
    audience: 'profesionales de email marketing B2B y B2C',
    tone: 'experto, directo, con datos y recomendaciones accionables',
    categories: ['Estrategia','Deliverability','IA y Email','Tendencias','Herramientas'],
    topics: [
      { title:'La IA generativa reduce costes de email marketing un 60% segun nuevo estudio', source:'X / Twitter', engagement:'24.2K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'Open rates B2B caen al 19%: analisis de que esta fallando en 2026', source:'Reddit', engagement:'1.8K upvotes', sent:'Negativo', sentClass:'sent-down' },
      { title:'Personalizacion con LLMs: casos reales de +45% conversion en nurturing', source:'LinkedIn', engagement:'8.9K impressions', sent:'Positivo', sentClass:'sent-up' },
      { title:'Google anuncia nuevas restricciones DMARC que afectaran a todos los ESPs en Q2', source:'X / Twitter', engagement:'18.5K menciones', sent:'Negativo', sentClass:'sent-down' },
      { title:'A/B testing de subject lines con IA: +34% CTR en campana real documentada', source:'Marketing News', engagement:'220 shares', sent:'Positivo', sentClass:'sent-up' },
      { title:'El resurgir del email plain-text: por que las marcas de lujo abandonan el HTML', source:'Reddit', engagement:'2.4K upvotes', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Automatizacion de lead nurturing: flujos que convierten en B2B 2026', source:'LinkedIn', engagement:'12K impressions', sent:'Positivo', sentClass:'sent-up' },
    ],
  },
  'ia-tecnologia': {
    label: 'IA & Tecnologia',
    audience: 'profesionales tech, desarrolladores y entusiastas de la IA',
    tone: 'tecnico pero accesible, con casos practicos y analisis critico',
    categories: ['IA Generativa','Herramientas','Industria','Investigacion','Productividad'],
    topics: [
      { title:'GPT-5 supera a humanos en razonamiento complejo segun nuevos benchmarks', source:'X / Twitter', engagement:'142K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'Anthropic publica investigacion sobre interpretabilidad de modelos grandes', source:'Hacker News', engagement:'3.2K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'Por que los agentes de IA siguen fallando en produccion: analisis tecnico', source:'Reddit', engagement:'5.8K upvotes', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Europa aprueba nuevas regulaciones de IA de alto riesgo: que cambia para tu empresa', source:'Tech News', engagement:'890 shares', sent:'Negativo', sentClass:'sent-down' },
      { title:'Cursor vs GitHub Copilot 2026: comparativa real tras 6 meses de uso', source:'Reddit', engagement:'7.1K upvotes', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Los modelos de razonamiento reducen costes de automatizacion un 40% en empresas', source:'LinkedIn', engagement:'15K impressions', sent:'Positivo', sentClass:'sent-up' },
      { title:'Apple Intelligence decepciona: analisis de por que llega tarde y que significa', source:'X / Twitter', engagement:'89K menciones', sent:'Negativo', sentClass:'sent-down' },
    ],
  },
  'ecommerce': {
    label: 'eCommerce & Retail',
    audience: 'gestores de tiendas online, directores de ecommerce y retailers',
    tone: 'practico, orientado a conversion y resultados de negocio',
    categories: ['Conversion','Logistica','IA y Retail','Tendencias','Plataformas'],
    topics: [
      { title:'Amazon lanza IA generativa para paginas de producto: +23% conversion en beta', source:'Ecommerce News', engagement:'4.5K shares', sent:'Positivo', sentClass:'sent-up' },
      { title:'TikTok Shop supera a Instagram Shopping en ventas directas en Europa', source:'X / Twitter', engagement:'67K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'El abandono de carrito sube al 78%: nuevas estrategias de recuperacion que funcionan', source:'Reddit', engagement:'2.1K upvotes', sent:'Negativo', sentClass:'sent-down' },
      { title:'Shopify vs WooCommerce 2026: que plataforma gana en coste total de propiedad', source:'Reddit', engagement:'3.8K upvotes', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Personalizacion dinamica con IA: tienda online multiplica por 3 su LTV medio', source:'LinkedIn', engagement:'22K impressions', sent:'Positivo', sentClass:'sent-up' },
      { title:'Costes de logistica last-mile suben un 18% en Q1: como proteger margenes', source:'Ecommerce News', engagement:'1.2K shares', sent:'Negativo', sentClass:'sent-down' },
    ],
  },
  'marketing-digital': {
    label: 'Marketing Digital',
    audience: 'marketers digitales, growth hackers y directores de marketing',
    tone: 'estrategico, con datos y ejemplos de campanas reales',
    categories: ['SEO','Paid Media','Contenido','Social','Analitica'],
    topics: [
      { title:'Google actualiza algoritmo core: webs de contenido caen un 30% de media', source:'X / Twitter', engagement:'95K menciones', sent:'Negativo', sentClass:'sent-down' },
      { title:'Meta Ads sube CPM un 22% en Q1 2026: estrategias para mantener ROAS positivo', source:'LinkedIn', engagement:'18K impressions', sent:'Negativo', sentClass:'sent-down' },
      { title:'El contenido largo vuelve a rankear: analisis de 10.000 articulos post-update', source:'Reddit', engagement:'4.2K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'LinkedIn Thought Leadership Ads: CPL un 40% menor que Search en B2B', source:'Marketing News', engagement:'780 shares', sent:'Positivo', sentClass:'sent-up' },
      { title:'Dark social representa el 60% del trafico referral: como medirlo en 2026', source:'Reddit', engagement:'3.1K upvotes', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Influencer marketing B2B: casos con ROI documentado en LinkedIn', source:'LinkedIn', engagement:'31K impressions', sent:'Positivo', sentClass:'sent-up' },
    ],
  },
  'startups': {
    label: 'Startups & Negocios',
    audience: 'fundadores, inversores, emprendedores y profesionales del ecosistema startup',
    tone: 'directo, inspirador, con lecciones practicas y sin corporativo',
    categories: ['Financiacion','Producto','Crecimiento','Cultura','Mercado'],
    topics: [
      { title:'Y Combinator S26: las tendencias que estan financiando ahora', source:'X / Twitter', engagement:'78K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'El 73% de startups que levantaron en 2021 no levantaran de nuevo: analisis', source:'TechCrunch', engagement:'5.6K shares', sent:'Negativo', sentClass:'sent-down' },
      { title:'De 0 a 1M ARR en 11 meses sin inversion: el playbook de un SaaS bootstrapped', source:'Reddit', engagement:'9.2K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'VCs reducen cheques en Series A: que significa para los fundadores ahora', source:'LinkedIn', engagement:'42K impressions', sent:'Negativo', sentClass:'sent-down' },
      { title:'Product-led growth en B2B: las metricas que importan segun 50 fundadores', source:'Reddit', engagement:'6.8K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'El solopreneur de IA: como una persona construye negocios de 7 cifras', source:'X / Twitter', engagement:'112K menciones', sent:'Mixto', sentClass:'sent-mix' },
    ],
  },
  'finanzas': {
    label: 'Finanzas & Economia',
    audience: 'inversores particulares, analistas financieros y profesionales de finanzas',
    tone: 'analitico, riguroso, con contexto macro y perspectiva accionable',
    categories: ['Mercados','Macro','Inversion','Cripto','Fintech'],
    topics: [
      { title:'La Fed mantiene tipos: que dicen los datos de inflacion de marzo', source:'Bloomberg', engagement:'23K shares', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Bitcoin supera los 120K: los argumentos de bulls y bears ahora mismo', source:'X / Twitter', engagement:'340K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'Banca europea reduce dividendos ante riesgos de credito: analisis por sectores', source:'Financial News', engagement:'3.4K shares', sent:'Negativo', sentClass:'sent-down' },
      { title:'ETFs de IA superan al S&P 500 por segundo anio consecutivo', source:'Reddit', engagement:'8.9K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'El yuan digital avanza: China procesa el 18% de pagos internacionales con CBDC', source:'Bloomberg', engagement:'12K shares', sent:'Mixto', sentClass:'sent-mix' },
    ],
  },
  'salud': {
    label: 'Salud & Bienestar',
    audience: 'personas interesadas en salud, profesionales sanitarios y emprendedores health',
    tone: 'cercano, basado en evidencia, con consejos practicos y sin alarmismo',
    categories: ['Investigacion','Nutricion','Salud Mental','Tecnologia Salud','Estilo de Vida'],
    topics: [
      { title:'Harvard: dormir 7 horas reduce riesgo cardiovascular un 34%', source:'Health News', engagement:'156K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'IA diagnostica cancer de pulmon en fase 0 con 94% precision: primer ensayo', source:'X / Twitter', engagement:'89K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'El 58% de trabajadores en riesgo alto de burnout: estudio europeo 2026', source:'LinkedIn', engagement:'34K impressions', sent:'Negativo', sentClass:'sent-down' },
      { title:'Ozempic y la paradoja del musculo: lo que los medicos no estan explicando', source:'Reddit', engagement:'12.4K upvotes', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Los 5 alimentos que la ciencia confirma que transforman tu microbioma intestinal', source:'Health News', engagement:'4.2K shares', sent:'Positivo', sentClass:'sent-up' },
    ],
  },
  'viajes': {
    label: 'Viajes & Turismo',
    audience: 'viajeros frecuentes, nomadas digitales y profesionales del turismo',
    tone: 'inspirador, con tips practicos y perspectiva de viajero experimentado',
    categories: ['Destinos','Tendencias','Tecnologia Viajes','Sostenibilidad','Trabajo Remoto'],
    topics: [
      { title:'Los 10 destinos menos masificados de Europa que explotan en 2026', source:'Travel News', engagement:'67K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'Japon limita acceso al Monte Fuji: el debate sobre el turismo de masas', source:'X / Twitter', engagement:'234K menciones', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Nomadas digitales en Espana: ciudades que ofrecen visados y beneficios reales', source:'Reddit', engagement:'18.6K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'Aerolineas low cost suben precios un 31%: estrategias para seguir viajando barato', source:'Reddit', engagement:'9.4K upvotes', sent:'Negativo', sentClass:'sent-down' },
      { title:'IA para planificar viajes: comparativa de Gemini vs ChatGPT vs Claude', source:'Travel News', engagement:'3.1K shares', sent:'Mixto', sentClass:'sent-mix' },
    ],
  },
  'deporte': {
    label: 'Deporte & Fitness',
    audience: 'entusiastas del deporte, atletas amateur y profesionales del fitness',
    tone: 'motivador, basado en ciencia del deporte, con tips practicos',
    categories: ['Entrenamiento','Nutricion Deportiva','Tecnologia','Competicion','Recuperacion'],
    topics: [
      { title:'El protocolo del equipo olimpico de atletismo de EEUU: detalles filtrados', source:'Reddit', engagement:'34K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'Creatina en mujeres: metaanalisis de 47 estudios confirma los mismos beneficios', source:'Sports News', engagement:'12K shares', sent:'Positivo', sentClass:'sent-up' },
      { title:'Cardio en ayunas: lo que dice la ciencia vs los influencers de fitness', source:'X / Twitter', engagement:'56K menciones', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Whoop 5 vs Oura Ring 4: comparativa tras 3 meses de test paralelo real', source:'Reddit', engagement:'8.9K upvotes', sent:'Mixto', sentClass:'sent-mix' },
      { title:'Por que el 80% abandona el gimnasio antes de 3 meses: psicologia del habito', source:'Sports News', engagement:'5.6K shares', sent:'Negativo', sentClass:'sent-down' },
    ],
  },
  'sostenibilidad': {
    label: 'Sostenibilidad',
    audience: 'profesionales de sostenibilidad, emprendedores green y consumidores conscientes',
    tone: 'constructivo, basado en datos, evitando greenwashing y siendo honesto',
    categories: ['Clima','Economia Circular','Energia','Empresas','Politica'],
    topics: [
      { title:'Solar supera al carbon en capacidad instalada mundial por primera vez', source:'Green News', engagement:'234K menciones', sent:'Positivo', sentClass:'sent-up' },
      { title:'El 68% de las afirmaciones eco corporativas son falsas o enganiosas: informe EU', source:'LinkedIn', engagement:'45K impressions', sent:'Negativo', sentClass:'sent-down' },
      { title:'Economia circular en Espana: empresas que ganan dinero real con ello', source:'Reddit', engagement:'3.4K upvotes', sent:'Positivo', sentClass:'sent-up' },
      { title:'Baterias de sodio vs litio: tecnologia que cambia el coste de la transicion energetica', source:'Green News', engagement:'7.8K shares', sent:'Positivo', sentClass:'sent-up' },
      { title:'COP31 sin acuerdo vinculante: que significa para los compromisos empresariales', source:'X / Twitter', engagement:'89K menciones', sent:'Negativo', sentClass:'sent-down' },
    ],
  },
};

// === ESTADO ===
let selectedIds    = new Set();
let generatedPosts = [];
let generatedNL    = null;
let wpConfig       = {};
let currentTopics  = [];

try { const s = sessionStorage.getItem('pd_wp'); if (s) wpConfig = JSON.parse(s); } catch(e) {}
fetch('/auth/me').then(function(r){ return r.json(); }).then(function(d){
  if (d.authenticated) document.getElementById('sidebarUser').textContent = d.user;
});

// === NICHO ===
function getCurrentNiche() {
  var sel = document.getElementById('nicheSelect');
  if (!sel) return NICHES['email-marketing'];
  var val = sel.value;
  if (val === 'custom') {
    var customEl = document.getElementById('nicheCustom');
    var label = (customEl ? customEl.value : '').trim() || 'Personalizado';
    return { label: label, audience: 'personas interesadas en ' + label, tone: 'informativo con datos practicos', categories: ['Tendencias','Analisis','Consejos','Noticias'], topics: [] };
  }
  return NICHES[val] || NICHES['email-marketing'];
}

function onNicheChange() {
  var sel = document.getElementById('nicheSelect');
  var val = sel ? sel.value : '';
  var c = document.getElementById('nicheCustom');
  if (c) c.style.display = val === 'custom' ? 'block' : 'none';
  if (currentTopics.length > 0) {
    selectedIds.clear(); currentTopics = [];
    document.getElementById('topicsWrap').style.display = 'none';
    document.getElementById('outputWrap').style.display = 'none';
    document.getElementById('actionBar').classList.remove('visible');
  }
}

// === SCAN ===
function scanTopics() {
  var btn = document.getElementById('scanBtn');
  var niche = getCurrentNiche();
  var sel = document.getElementById('nicheSelect');
  var isCustom = sel ? sel.value === 'custom' : false;
  setLoading(btn, true);
  selectedIds.clear();
  if (isCustom) {
    scanWithAI(niche).then(function(){ setLoading(btn, false); }).catch(function(e){ console.error(e); setLoading(btn, false); });
  } else {
    scanFromCatalog(niche).then(function(){ setLoading(btn, false); }).catch(function(e){ console.error(e); setLoading(btn, false); });
  }
}

function delay(ms) { return new Promise(function(r){ setTimeout(r, ms); }); }

function scanFromCatalog(niche) {
  return delay(700).then(function() {
    currentTopics = niche.topics.map(function(t, i) {
      return Object.assign({}, t, { id: i + 1, badge: sourceToBadge(t.source) });
    });
    showTopics(niche);
  });
}

function scanWithAI(niche) {
  var prompt = 'Genera 7 trending topics realistas sobre "' + niche.label + '". Titulares con datos especificos. Fuentes: X/Twitter, Reddit, LinkedIn o medios especializados. Responde SOLO con JSON sin backticks: {"topics":[{"title":"...","source":"...","engagement":"...","sent":"Positivo","sentClass":"sent-up"}]}. Mezcla sent-up/sent-down/sent-mix.';
  return callAI([{ role: 'user', content: prompt }], null, 800)
    .then(function(text) {
      var data = JSON.parse(text.replace(/```json|```/g, '').trim());
      currentTopics = (data.topics || []).map(function(t, i) {
        return Object.assign({}, t, { id: i + 1, badge: sourceToBadge(t.source) });
      });
      showTopics(niche);
    })
    .catch(function(e) {
      console.error('AI topics failed:', e);
      currentTopics = niche.topics.length > 0
        ? niche.topics.map(function(t, i){ return Object.assign({}, t, { id: i+1, badge: sourceToBadge(t.source) }); })
        : [{ id:1, title:'Tendencias en ' + niche.label, source:'LinkedIn', badge:'badge-linkedin', engagement:'12K impressions', sent:'Positivo', sentClass:'sent-up' }];
      showTopics(niche);
      showToast('Topics del catalogo (IA no disponible)', false);
    });
}

function showTopics(niche) {
  document.getElementById('topicsWrap').style.display = 'block';
  var subhead = document.querySelector('#topicsWrap .subhead-title');
  if (subhead) subhead.innerHTML = '<span class="niche-pill">' + (niche ? niche.label : '') + '</span>&nbsp;&middot;&nbsp;<span>' + currentTopics.length + ' topics</span>';
  renderTopics();
  document.getElementById('topicsWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// === TOPICS RENDER ===
function renderTopics() {
  var grid = document.getElementById('topicsGrid');
  grid.innerHTML = '';
  currentTopics.forEach(function(t, i) {
    var el = document.createElement('div');
    el.className = 'topic-card' + (selectedIds.has(t.id) ? ' selected' : '');
    el.style.animationDelay = (i * 0.04) + 's';
    el.innerHTML = '<div class="topic-row1"><span class="source-badge ' + t.badge + '">' + t.source + '</span><span class="topic-engagement">' + t.engagement + '</span><div class="topic-check">&#10003;</div></div><div class="topic-title">' + t.title + '</div><div class="topic-meta"><span class="' + t.sentClass + '">' + t.sent + '</span></div>';
    el.onclick = function(){ toggleTopic(t.id, el); };
    grid.appendChild(el);
  });
}

function toggleTopic(id, el) {
  if (selectedIds.has(id)) { selectedIds.delete(id); } else { selectedIds.add(id); }
  el.classList.toggle('selected', selectedIds.has(id));
  updateActionBar();
}

function updateActionBar() {
  document.getElementById('selectedCount').textContent = selectedIds.size;
  document.getElementById('actionBar').classList.toggle('visible', selectedIds.size > 0);
}

function clearSelection() {
  selectedIds.clear();
  document.querySelectorAll('.topic-card').forEach(function(c){ c.classList.remove('selected'); });
  updateActionBar();
}

// === GENERATE ===
function generateAll() {
  if (selectedIds.size === 0) return;
  var btn = document.getElementById('generateBtn');
  setLoading(btn, true);
  var niche    = getCurrentNiche();
  var selected = currentTopics.filter(function(t){ return selectedIds.has(t.id); });
  var topicsList = selected.map(function(t){ return '- "' + t.title + '" [' + t.source + ', ' + t.engagement + ']'; }).join('\n');
  var cats = niche.categories.join(', ');
  var prompt = 'Eres un content strategist experto en ' + niche.label + '. Audiencia: ' + niche.audience + '. Hoy es ' + todayFormatted() + '.\n\nTopics de ' + niche.label + ':\n' + topicsList + '\n\nTono: ' + niche.tone + '. Categorias del blog: ' + cats + '.\n\nResponde SOLO con JSON sin backticks:\n{"subject_line":"Subject max 50 chars sin emojis","preheader":"Preheader max 90 chars","intro_blurb":"Apertura 1-2 lineas tono agil","posts":[{"wp_title":"Titulo SEO max 65 chars","wp_excerpt":"Extracto 2-3 frases","wp_content":"4-5 frases: contexto + datos + impacto + recomendacion","wp_category":"una de: ' + cats + '","snip_title":"Titular max 60 chars","snip_body":"2-3 frases: dato > impacto > accion","source":"fuente"}]}';
  callAI([{ role: 'user', content: prompt }], null, 2000)
    .then(function(text) {
      var data = JSON.parse(text.replace(/```json|```/g, '').trim());
      generatedNL    = Object.assign({}, data, { _niche: niche });
      generatedPosts = (data.posts || []).map(function(p, i){ return Object.assign({}, p, { _idx: i, _status: 'pending' }); });
      renderOutput(data, niche);
    })
    .catch(function(err) {
      console.error(err);
      var fallback = buildFallback(selected, niche);
      generatedNL    = Object.assign({}, fallback, { _niche: niche });
      generatedPosts = fallback.posts.map(function(p, i){ return Object.assign({}, p, { _idx: i, _status: 'pending' }); });
      renderOutput(fallback, niche);
      showToast('IA no disponible - contenido de ejemplo', true);
    })
    .finally(function() {
      setLoading(btn, false);
      document.getElementById('outputWrap').style.display = 'block';
      document.getElementById('outputWrap').scrollIntoView({ behavior: 'smooth' });
    });
}

function buildFallback(selected, niche) {
  return {
    subject_line: 'Lo que mueve ' + niche.label + ' hoy',
    preheader:    'Tendencias y datos - PEDRI',
    intro_blurb:  niche.label + ' se mueve. Aqui las seniales que importan esta semana.',
    posts: selected.map(function(t, i) { return {
      wp_title:    t.title.slice(0, 65),
      wp_excerpt:  'Tendencia clave en ' + niche.label + ' que redefine el panorama.',
      wp_content:  t.title + '. Contexto relevante para ' + niche.audience + '. Analiza y actua.',
      wp_category: niche.categories[i % niche.categories.length],
      snip_title:  t.title.slice(0, 60),
      snip_body:   'Senal importante en ' + niche.label + '. Analisis e impacto para esta semana.',
      source: t.source,
    }; }),
  };
}

// === RENDER ===
function renderOutput(data, niche) {
  renderBlogPosts();
  renderNewsletter(data, niche);
  if (wpConfig.wp_url) document.getElementById('wpDomain').textContent = wpConfig.wp_url;
}

function renderBlogPosts() {
  var list = document.getElementById('postsList');
  list.innerHTML = '';
  generatedPosts.forEach(function(p, i) {
    var el = document.createElement('div');
    el.className = 'post-item'; el.id = 'pi-' + i;
    el.style.animationDelay = (i * 0.05) + 's';
    el.innerHTML = '<div class="post-num">0' + (i+1) + '</div><div><div class="post-cat">' + p.wp_category + '</div><div class="post-title-out">' + p.wp_title + '</div><div class="post-excerpt-out">' + p.wp_excerpt + '</div></div><div class="post-status s-pending" id="ps-' + i + '"><span class="s-dot"></span>Pendiente</div>';
    list.appendChild(el);
  });
}

function setPostStatus(i, cls, label) {
  var el = document.getElementById('ps-' + i);
  if (el) { el.className = 'post-status ' + cls; el.innerHTML = '<span class="s-dot"></span>' + label; }
}

function renderNewsletter(data, niche) {
  var subject = data.subject_line || '';
  document.getElementById('emailSubjectPill').textContent = 'Asunto: ' + subject;
  document.getElementById('nlSubject').textContent = subject;
  var nicheLabel = niche ? niche.label : '';
  var snips = (data.posts || []).map(function(p) {
    return '<div class="em-snip"><div class="em-snip-src">' + p.source + '</div><div class="em-snip-h">' + p.snip_title + '</div><div class="em-snip-p">' + p.snip_body + '</div><a href="#" class="em-snip-cta">Leer mas</a></div>';
  }).join('');
  document.getElementById('emailPreview').innerHTML = '<div class="em-outer"><div class="em-topbar"></div><div class="em-header"><div class="em-logo">PEDRI</div><div class="em-tagline">' + nicheLabel + '</div><div class="em-dateline">' + todayFormatted() + '</div></div><div class="em-introbelt"><p>' + data.intro_blurb + '</p></div><div class="em-subject">' + subject + '</div><div class="em-preheader">' + data.preheader + '</div><div class="em-divider"></div><div class="em-snippets">' + snips + '</div><div class="em-footer"><div class="em-footer-logo">PEDRI</div><p>Recibes esto porque te suscribiste a PEDRI<br><a href="#">Cancelar suscripcion</a> &middot; <a href="#">Ver en navegador</a></p></div></div>';
}

// === WORDPRESS ===
function publishAll() {
  if (!wpConfig.wp_url) { showToast('Primero configura WordPress', true); openWPModal(); return; }
  var btn = document.getElementById('publishBtn');
  setLoading(btn, true);
  generatedPosts.forEach(function(_, i){ setPostStatus(i, 's-pending', 'Publicando...'); });
  publishToWP(
    generatedPosts.map(function(p){ return { title: p.wp_title, content: '<p>' + p.wp_content + '</p>', excerpt: p.wp_excerpt }; }),
    { wp_url: wpConfig.wp_url, wp_user: wpConfig.wp_user, wp_password: wpConfig.wp_password }
  ).then(function(res) {
    res.results.forEach(function(r, i) {
      if (r.ok) setPostStatus(i, 's-published', 'Publicado #' + r.id);
      else      setPostStatus(i, 's-error', 'Error: ' + r.error);
    });
    var ok  = res.results.filter(function(r){ return r.ok; }).length;
    var err = res.results.filter(function(r){ return !r.ok; }).length;
    showToast(err ? ok + ' publicados, ' + err + ' errores' : ok + ' posts publicados', err > 0);
  }).catch(function(e) {
    generatedPosts.forEach(function(_, i){ setPostStatus(i, 's-error', 'Error'); });
    showToast('Error: ' + e.message, true);
  }).finally(function(){ setLoading(btn, false); });
}

// === EXPORT HTML ===
function buildExportHTML() {
  if (!generatedNL) return '';
  var data  = generatedNL;
  var niche = data._niche || { label: '' };
  var today = todayFormatted();
  var snips = (data.posts || []).map(function(p) {
    return '<tr><td style="padding:18px 32px;border-bottom:1px solid #e8e4dc;"><p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#888;margin:0 0 5px">' + p.source + '</p><h2 style="font-family:Arial,sans-serif;font-weight:900;font-size:16px;color:#1a1916;margin:0 0 8px">' + p.snip_title + '</h2><p style="font-family:Georgia,serif;font-size:13px;color:#444;line-height:1.7;margin:0 0 10px">' + p.snip_body + '</p><a href="#" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#a8840b;text-transform:uppercase;text-decoration:none">Leer mas</a></td></tr>';
  }).join('');
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>' + data.subject_line + '</title></head><body style="margin:0;padding:0;background:#e8e4dc;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8e4dc;"><tr><td align="center" style="padding:24px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#f7f4ef;max-width:600px;"><tr><td style="background:#1a1916;height:4px;font-size:0;">&nbsp;</td></tr><tr><td style="background:#1a1916;padding:28px 32px;text-align:center;"><p style="font-family:Arial,sans-serif;font-weight:900;font-size:18px;color:#c49a0e;letter-spacing:4px;text-transform:uppercase;margin:0">PEDRI</p><p style="font-size:11px;color:#888;font-style:italic;margin:4px 0 0">' + niche.label + '</p><p style="font-size:10px;color:#777;letter-spacing:2px;text-transform:uppercase;margin:8px 0 0">' + today + '</p></td></tr><tr><td style="background:#c49a0e;padding:14px 32px;text-align:center;"><p style="font-family:Georgia,serif;font-size:13px;color:#1a1a0a;font-style:italic;line-height:1.6;margin:0">' + data.intro_blurb + '</p></td></tr><tr><td style="font-family:Arial,sans-serif;font-weight:900;font-size:18px;color:#1a1916;text-align:center;padding:22px 32px 6px">' + data.subject_line + '</td></tr><tr><td style="font-family:Georgia,serif;font-size:12px;color:#888;text-align:center;padding:0 32px 18px;font-style:italic">' + data.preheader + '</td></tr><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + snips + '</table><tr><td style="background:#1a1916;padding:22px 32px;text-align:center;"><p style="font-family:Arial,sans-serif;font-weight:900;font-size:13px;color:#c49a0e;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px">PEDRI</p><p style="font-size:11px;color:#555;line-height:1.8;margin:0">Recibes esto porque te suscribiste a PEDRI</p></td></tr></table></td></tr></table></body></html>';
}

function doCopyHTML() {
  var html = buildExportHTML();
  if (!html) { showToast('Primero genera la newsletter', true); return; }
  copyToClipboard(html).then(function(){ showToast('HTML copiado para tu ESP'); });
}

function openSrcModal() {
  var html = buildExportHTML();
  if (!html) { showToast('Primero genera la newsletter', true); return; }
  document.getElementById('codeBlock').textContent = html;
  document.getElementById('srcModal').classList.add('open');
}

// === WP MODAL ===
function openWPModal() {
  document.getElementById('wpUrl').value     = wpConfig.wp_url     || '';
  document.getElementById('wpUser').value    = wpConfig.wp_user    || '';
  document.getElementById('wpAppPass').value = wpConfig.wp_password || '';
  document.getElementById('wpTestResult').className = 'wp-test-result';
  document.getElementById('wpModal').classList.add('open');
}

function testWP() {
  var btn = document.getElementById('testWPBtn');
  var result = document.getElementById('wpTestResult');
  setLoading(btn, true); result.className = 'wp-test-result';
  var cfg = { wp_url: document.getElementById('wpUrl').value.trim().replace(/\/$/,''), wp_user: document.getElementById('wpUser').value.trim(), wp_password: document.getElementById('wpAppPass').value.trim() };
  testWPConnection(cfg).then(function(data) {
    result.className = 'wp-test-result ' + (data.ok ? 'ok' : 'err');
    result.textContent = data.ok ? 'Conectado como "' + data.wp_user + '"' : 'Error: ' + data.error;
  }).catch(function(e) {
    result.className = 'wp-test-result err';
    result.textContent = 'Error: ' + e.message;
  }).finally(function(){ setLoading(btn, false); });
}

function saveWP() {
  wpConfig = { wp_url: document.getElementById('wpUrl').value.trim().replace(/\/$/,''), wp_user: document.getElementById('wpUser').value.trim(), wp_password: document.getElementById('wpAppPass').value.trim() };
  try { sessionStorage.setItem('pd_wp', JSON.stringify(wpConfig)); } catch(e) {}
  closeModal('wpModal');
  if (wpConfig.wp_url) document.getElementById('wpDomain').textContent = wpConfig.wp_url;
  showToast('WordPress configurado');
}

// === UTILS ===
function sourceToBadge(s) {
  s = (s || '').toLowerCase();
  if (s.includes('twitter') || s === 'x') return 'badge-x';
  if (s.includes('reddit'))               return 'badge-reddit';
  if (s.includes('linkedin'))             return 'badge-linkedin';
  return 'badge-news';
}
function closeModal(id)      { document.getElementById(id).classList.remove('open'); }
function closeOverlay(e, id) { if (e.target.id === id) closeModal(id); }
function setLoading(btn, on) { btn.disabled = on; btn.classList.toggle('is-loading', on); }