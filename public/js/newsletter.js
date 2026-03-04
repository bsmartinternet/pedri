/* newsletter.js — PEDRI · Sistema de nichos temáticos */
'use strict';

const NICHES = {
  'email-marketing': {
    label: 'Email Marketing',
    audience: 'profesionales de email marketing B2B y B2C',
    tone: 'experto, directo, con datos y recomendaciones accionables',
    categories: ['Estrategia','Deliverability','IA & Email','Tendencias','Herramientas'],
    sources: ['X / Twitter','Reddit','LinkedIn','Marketing News'],
    topics: [
      { title:'La IA generativa reduce costes de email marketing un 60% según nuevo estudio', source:'X / Twitter', engagement:'24.2K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Open rates B2B caen al 19%: análisis de qué está fallando en 2026', source:'Reddit', engagement:'1.8K upvotes', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'Personalización con LLMs: casos reales de +45% conversión en nurturing', source:'LinkedIn', engagement:'8.9K impressions', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Google anuncia nuevas restricciones DMARC que afectarán a todos los ESPs en Q2', source:'X / Twitter', engagement:'18.5K menciones', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'A/B testing de subject lines con IA: +34% CTR en campaña real documentada', source:'Marketing News', engagement:'220 shares', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'El resurgir del email plain-text: por qué las marcas de lujo abandonan el HTML', source:'Reddit', engagement:'2.4K upvotes', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Automatización de lead nurturing: flujos que convierten en B2B 2026', source:'LinkedIn', engagement:'12K impressions', sent:'↑ Positivo', sentClass:'sent-up' },
    ],
  },
  'ia-tecnologia': {
    label: 'IA & Tecnología',
    audience: 'profesionales tech, desarrolladores y entusiastas de la IA',
    tone: 'técnico pero accesible, con casos prácticos y análisis crítico',
    categories: ['IA Generativa','Herramientas','Industria','Investigación','Productividad'],
    sources: ['X / Twitter','Reddit','Hacker News','Tech News'],
    topics: [
      { title:'OpenAI lanza GPT-5: benchmark supera a humanos en razonamiento complejo', source:'X / Twitter', engagement:'142K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Anthropic publica investigación sobre interpretabilidad de modelos grandes', source:'Hacker News', engagement:'3.2K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Por qué los agentes de IA siguen fallando en producción: análisis técnico', source:'Reddit', engagement:'5.8K upvotes', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Europa aprueba nuevas regulaciones de IA de alto riesgo: qué cambia para tu empresa', source:'Tech News', engagement:'890 shares', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'Cursor vs GitHub Copilot 2026: comparativa real tras 6 meses de uso intensivo', source:'Reddit', engagement:'7.1K upvotes', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Los modelos de razonamiento reducen costes de automatización un 40% en empresas', source:'LinkedIn', engagement:'15K impressions', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Apple Intelligence decepciona: análisis de por qué llega tarde y qué significa', source:'X / Twitter', engagement:'89K menciones', sent:'↓ Negativo', sentClass:'sent-down' },
    ],
  },
  'ecommerce': {
    label: 'eCommerce & Retail',
    audience: 'gestores de tiendas online, directores de ecommerce y retailers',
    tone: 'práctico, orientado a conversión y resultados de negocio',
    categories: ['Conversión','Logística','IA & Retail','Tendencias','Plataformas'],
    sources: ['X / Twitter','Reddit','LinkedIn','Ecommerce News'],
    topics: [
      { title:'Amazon lanza IA generativa para páginas de producto: +23% conversión en beta', source:'Ecommerce News', engagement:'4.5K shares', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'TikTok Shop supera a Instagram Shopping en ventas directas en Europa', source:'X / Twitter', engagement:'67K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'El abandono de carrito sube al 78%: nuevas estrategias de recuperación que funcionan', source:'Reddit', engagement:'2.1K upvotes', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'Shopify vs WooCommerce 2026: qué plataforma gana en coste total de propiedad', source:'Reddit', engagement:'3.8K upvotes', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Personalización dinámica con IA: tienda online multiplica por 3 su LTV medio', source:'LinkedIn', engagement:'22K impressions', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Costes de logística last-mile suben un 18% en Q1: cómo proteger márgenes', source:'Ecommerce News', engagement:'1.2K shares', sent:'↓ Negativo', sentClass:'sent-down' },
    ],
  },
  'marketing-digital': {
    label: 'Marketing Digital',
    audience: 'marketers digitales, growth hackers y directores de marketing',
    tone: 'estratégico, con datos y ejemplos de campañas reales',
    categories: ['SEO','Paid Media','Contenido','Social','Analítica'],
    sources: ['X / Twitter','Reddit','LinkedIn','Marketing News'],
    topics: [
      { title:'Google actualiza algoritmo core: webs de contenido caen un 30% de media', source:'X / Twitter', engagement:'95K menciones', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'Meta Ads sube CPM un 22% en Q1 2026: estrategias para mantener ROAS positivo', source:'LinkedIn', engagement:'18K impressions', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'El contenido largo vuelve a rankear: análisis de 10.000 artículos post-update', source:'Reddit', engagement:'4.2K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'LinkedIn Thought Leadership Ads: CPL un 40% menor que Search en B2B', source:'Marketing News', engagement:'780 shares', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Dark social representa el 60% del tráfico referral: cómo medirlo en 2026', source:'Reddit', engagement:'3.1K upvotes', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Influencer marketing B2B: casos con ROI documentado en LinkedIn', source:'LinkedIn', engagement:'31K impressions', sent:'↑ Positivo', sentClass:'sent-up' },
    ],
  },
  'startups': {
    label: 'Startups & Negocios',
    audience: 'fundadores, inversores, emprendedores y profesionales del ecosistema startup',
    tone: 'directo, inspirador, con lecciones prácticas y sin bullshit corporativo',
    categories: ['Financiación','Producto','Crecimiento','Cultura','Mercado'],
    sources: ['X / Twitter','Reddit','LinkedIn','TechCrunch'],
    topics: [
      { title:'Y Combinator S26: las tendencias que están financiando ahora', source:'X / Twitter', engagement:'78K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'El 73% de startups que levantaron en 2021 no levantarán de nuevo: análisis', source:'TechCrunch', engagement:'5.6K shares', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'De 0 a 1M ARR en 11 meses sin inversión: el playbook de un SaaS bootstrapped', source:'Reddit', engagement:'9.2K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'VCs reducen cheques en Series A: qué significa para los fundadores ahora', source:'LinkedIn', engagement:'42K impressions', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'Product-led growth en B2B: las métricas que importan según 50 fundadores', source:'Reddit', engagement:'6.8K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'El solopreneur de IA: cómo una persona construye negocios de 7 cifras', source:'X / Twitter', engagement:'112K menciones', sent:'→ Mixto', sentClass:'sent-mix' },
    ],
  },
  'finanzas': {
    label: 'Finanzas & Economía',
    audience: 'inversores particulares, analistas financieros y profesionales de finanzas',
    tone: 'analítico, riguroso, con contexto macro y perspectiva accionable',
    categories: ['Mercados','Macro','Inversión','Cripto','Fintech'],
    sources: ['X / Twitter','Reddit','Bloomberg','Financial News'],
    topics: [
      { title:'La Fed mantiene tipos: qué dicen los datos de inflación de marzo', source:'Bloomberg', engagement:'23K shares', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Bitcoin supera los 120K: los argumentos de bulls y bears ahora mismo', source:'X / Twitter', engagement:'340K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Banca europea reduce dividendos ante riesgos de crédito: análisis por sectores', source:'Financial News', engagement:'3.4K shares', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'ETFs de IA superan al S&P 500 por segundo año consecutivo', source:'Reddit', engagement:'8.9K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'El yuan digital avanza: China procesa el 18% de pagos internacionales con CBDC', source:'Bloomberg', engagement:'12K shares', sent:'→ Mixto', sentClass:'sent-mix' },
    ],
  },
  'salud-bienestar': {
    label: 'Salud & Bienestar',
    audience: 'personas interesadas en salud, profesionales sanitarios y emprendedores health',
    tone: 'cercano, basado en evidencia, con consejos prácticos y sin alarmismo',
    categories: ['Investigación','Nutrición','Salud Mental','Tecnología Salud','Estilo de Vida'],
    sources: ['X / Twitter','Reddit','Health News','LinkedIn'],
    topics: [
      { title:'Harvard: dormir 7 horas reduce riesgo cardiovascular un 34% según nuevo estudio', source:'Health News', engagement:'156K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'IA diagnostica cáncer de pulmón en fase 0 con 94% precisión: primer ensayo clínico', source:'X / Twitter', engagement:'89K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'El 58% de trabajadores en riesgo alto de burnout: estudio europeo 2026', source:'LinkedIn', engagement:'34K impressions', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'Ozempic y la paradoja del músculo: lo que los médicos no están explicando', source:'Reddit', engagement:'12.4K upvotes', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Los 5 alimentos que la ciencia confirma que transforman tu microbioma intestinal', source:'Health News', engagement:'4.2K shares', sent:'↑ Positivo', sentClass:'sent-up' },
    ],
  },
  'viajes': {
    label: 'Viajes & Turismo',
    audience: 'viajeros frecuentes, nómadas digitales y profesionales del turismo',
    tone: 'inspirador, con tips prácticos y perspectiva de viajero experimentado',
    categories: ['Destinos','Tendencias','Tecnología Viajes','Sostenibilidad','Trabajo Remoto'],
    sources: ['X / Twitter','Reddit','Travel News','Instagram'],
    topics: [
      { title:'Los 10 destinos menos masificados de Europa que explotan en 2026', source:'Travel News', engagement:'67K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Japón limita el acceso al Monte Fuji: el debate sobre el turismo de masas', source:'X / Twitter', engagement:'234K menciones', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Nómadas digitales en España: ciudades que ofrecen visados y beneficios reales', source:'Reddit', engagement:'18.6K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Aerolíneas low cost suben precios un 31%: estrategias para seguir viajando barato', source:'Reddit', engagement:'9.4K upvotes', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'IA para planificar viajes: comparativa honesta de Gemini vs ChatGPT vs Claude', source:'Travel News', engagement:'3.1K shares', sent:'→ Mixto', sentClass:'sent-mix' },
    ],
  },
  'deporte': {
    label: 'Deporte & Fitness',
    audience: 'entusiastas del deporte, atletas amateur, entrenadores y profesionales del fitness',
    tone: 'motivador, basado en ciencia del deporte, con tips prácticos',
    categories: ['Entrenamiento','Nutrición Deportiva','Tecnología','Competición','Recuperación'],
    sources: ['X / Twitter','Reddit','Sports News','YouTube'],
    topics: [
      { title:'El protocolo de entrenamiento del equipo olímpico de EEUU: detalles filtrados', source:'Reddit', engagement:'34K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Creatina en mujeres: metaanálisis de 47 estudios confirma los mismos beneficios', source:'Sports News', engagement:'12K shares', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Cardio en ayunas: lo que dice la ciencia vs los influencers de fitness', source:'X / Twitter', engagement:'56K menciones', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Whoop 5 vs Oura Ring 4: comparativa tras 3 meses de test paralelo real', source:'Reddit', engagement:'8.9K upvotes', sent:'→ Mixto', sentClass:'sent-mix' },
      { title:'Por qué el 80% abandona el gimnasio antes de 3 meses: psicología del hábito', source:'Sports News', engagement:'5.6K shares', sent:'↓ Negativo', sentClass:'sent-down' },
    ],
  },
  'sostenibilidad': {
    label: 'Sostenibilidad',
    audience: 'profesionales de sostenibilidad, emprendedores green y consumidores conscientes',
    tone: 'constructivo, basado en datos, evitando greenwashing y siendo honesto sobre trade-offs',
    categories: ['Clima','Economía Circular','Energía','Empresas','Política'],
    sources: ['X / Twitter','Reddit','Green News','LinkedIn'],
    topics: [
      { title:'Solar supera al carbón en capacidad instalada mundial por primera vez en la historia', source:'Green News', engagement:'234K menciones', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'El 68% de las afirmaciones "eco" corporativas son falsas o engañosas: informe EU', source:'LinkedIn', engagement:'45K impressions', sent:'↓ Negativo', sentClass:'sent-down' },
      { title:'Economía circular en España: empresas que ganan dinero real con ello', source:'Reddit', engagement:'3.4K upvotes', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'Baterías de sodio vs litio: la tecnología que cambia el coste de la transición', source:'Green News', engagement:'7.8K shares', sent:'↑ Positivo', sentClass:'sent-up' },
      { title:'COP31 sin acuerdo vinculante: qué significa para los compromisos empresariales', source:'X / Twitter', engagement:'89K menciones', sent:'↓ Negativo', sentClass:'sent-down' },
    ],
  },
};

// ═══ ESTADO ═══
let selectedIds    = new Set();
let generatedPosts = [];
let generatedNL    = null;
let wpConfig       = {};
let currentTopics  = [];

try { const s = sessionStorage.getItem('pd_wp'); if (s) wpConfig = JSON.parse(s); } catch(e) {}
fetch('/auth/me').then(r => r.json()).then(d => {
  if (d.authenticated) document.getElementById('sidebarUser').textContent = d.user;
});

// ═══ NICHO ═══
function getCurrentNiche() {
  const sel = document.getElementById('nicheSelect');
  if (!sel) return NICHES['email-marketing'];
  const val = sel.value;
  if (val === 'custom') {
    const label = (document.getElementById('nicheCustom')?.value || '').trim() || 'Personalizado';
    return {
      label, audience: 'personas interesadas en ' + label,
      tone: 'informativo, con perspectiva práctica y datos concretos',
      categories: ['Tendencias','Análisis','Consejos','Noticias','Opinión'],
      sources: ['X / Twitter','Reddit','LinkedIn','Noticias'], topics: [],
    };
  }
  return NICHES[val] || NICHES['email-marketing'];
}

function onNicheChange() {
  const val = document.getElementById('nicheSelect').value;
  const c = document.getElementById('nicheCustom');
  if (c) c.style.display = val === 'custom' ? 'block' : 'none';
  if (currentTopics.length > 0) {
    selectedIds.clear(); currentTopics = [];
    document.getElementById('topicsWrap').style.display = 'none';
    document.getElementById('outputWrap').style.display = 'none';
    document.getElementById('actionBar').classList.remove('visible');
  }
}

// ═══ SCAN ═══
async function scanTopics() {
  const btn = document.getElementById('scanBtn');
  const niche = getCurrentNiche();
  const useAI = document.getElementById('nicheSelect').value === 'custom';
  setLoading(btn, true);
  selectedIds.clear();
  useAI ? await scanWithAI(niche) : await scanFromCatalog(niche);
  setLoading(btn, false);
}

async function scanFromCatalog(niche) {
  await delay(700);
  currentTopics = niche.topics.map((t, i) => ({ ...t, id: i + 1, badge: sourceToBadge(t.source) }));
  showTopics(niche);
}

async function scanWithAI(niche) {
  const prompt = 'Genera 7 trending topics realistas y actuales sobre "' + niche.label + '" que podrían circular hoy. Titulares impactantes con datos específicos. Fuentes: X/Twitter, Reddit, LinkedIn o medios especializados. Responde SOLO con JSON sin backticks: {"topics":[{"title":"...","source":"...","engagement":"...","sent":"↑ Positivo","sentClass":"sent-up"}]}. Mezcla sentimientos (sent-up/sent-down/sent-mix). Titulares específicos con números reales.';
  try {
    const text = await callAI([{ role: 'user', content: prompt }], null, 800);
    const data = JSON.parse(text.replace(/```json|```/g, '').trim());
    currentTopics = (data.topics || []).map((t, i) => ({ ...t, id: i + 1, badge: sourceToBadge(t.source) }));
  } catch(e) {
    currentTopics = niche.topics.length > 0
      ? niche.topics.map((t, i) => ({ ...t, id: i + 1, badge: sourceToBadge(t.source) }))
      : [{ id:1, title:'Tendencias en ' + niche.label + ' esta semana', source:'LinkedIn', badge:'badge-linkedin', engagement:'12K impressions', sent:'↑ Positivo', sentClass:'sent-up' }];
    showToast('Topics generados desde catálogo', false);
  }
  showTopics(niche);
}

function showTopics(niche) {
  document.getElementById('topicsWrap').style.display = 'block';
  const subhead = document.querySelector('#topicsWrap .subhead-title');
  if (subhead) subhead.innerHTML = '<span class="niche-pill">' + (niche ? niche.label : '') + '</span> &middot; <span id="topicCount">' + currentTopics.length + '</span> topics';
  renderTopics();
  document.getElementById('topicsWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══ TOPICS ═══
function renderTopics() {
  const grid = document.getElementById('topicsGrid');
  grid.innerHTML = '';
  currentTopics.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'topic-card' + (selectedIds.has(t.id) ? ' selected' : '');
    el.style.animationDelay = (i * 0.04) + 's';
    el.innerHTML = '<div class="topic-row1"><span class="source-badge ' + t.badge + '">' + t.source + '</span><span class="topic-engagement">' + t.engagement + '</span><div class="topic-check">&#10003;</div></div><div class="topic-title">' + t.title + '</div><div class="topic-meta"><span class="' + t.sentClass + '">' + t.sent + '</span></div>';
    el.onclick = () => toggleTopic(t.id, el);
    grid.appendChild(el);
  });
}

function toggleTopic(id, el) {
  selectedIds.has(id) ? selectedIds.delete(id) : selectedIds.add(id);
  el.classList.toggle('selected', selectedIds.has(id));
  updateActionBar();
}

function updateActionBar() {
  document.getElementById('selectedCount').textContent = selectedIds.size;
  document.getElementById('actionBar').classList.toggle('visible', selectedIds.size > 0);
}

function clearSelection() {
  selectedIds.clear();
  document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
  updateActionBar();
}

// ═══ GENERATE ═══
async function generateAll() {
  if (selectedIds.size === 0) return;
  const btn = document.getElementById('generateBtn');
  setLoading(btn, true);
  const niche    = getCurrentNiche();
  const selected = currentTopics.filter(t => selectedIds.has(t.id));
  const topicsList = selected.map(t => '- "' + t.title + '" [' + t.source + ', ' + t.engagement + ']').join('
');
  const cats = niche.categories.join(', ');

  const prompt = 'Eres un content strategist experto en ' + niche.label + '. Tu audiencia son ' + niche.audience + '. Hoy es ' + todayFormatted() + '.

Con estos trending topics de ' + niche.label + ', genera contenido para publicar en blog y newsletter diaria:

' + topicsList + '

Tono requerido: ' + niche.tone + '.
Categorías del blog: ' + cats + '.

Responde SOLO con JSON válido sin backticks:
{"subject_line":"Subject máx 50 chars impacto inmediato sin emojis","preheader":"Preheader máx 90 chars","intro_blurb":"Apertura newsletter 1-2 líneas tono ágil estilo The Hustle","posts":[{"wp_title":"Título SEO máx 65 chars","wp_excerpt":"Extracto 2-3 frases insight clave","wp_content":"4-5 frases: contexto + datos + impacto + recomendación accionable","wp_category":"una de: ' + cats + '","snip_title":"Titular newsletter máx 60 chars estilo The Hustle","snip_body":"2-3 frases: dato concreto > impacto > qué hacer","source":"nombre fuente"}]}';

  try {
    const text = await callAI([{ role: 'user', content: prompt }], null, 2000);
    const data = JSON.parse(text.replace(/```json|```/g, '').trim());
    generatedNL = { ...data, _niche: niche };
    generatedPosts = (data.posts || []).map((p, i) => ({ ...p, _idx: i, _status: 'pending' }));
    renderOutput(data, niche);
  } catch(err) {
    console.error(err);
    const fallback = buildFallback(selected, niche);
    generatedNL = { ...fallback, _niche: niche };
    generatedPosts = fallback.posts.map((p, i) => ({ ...p, _idx: i, _status: 'pending' }));
    renderOutput(fallback, niche);
    showToast('IA no disponible — contenido de ejemplo', true);
  }
  setLoading(btn, false);
  document.getElementById('outputWrap').style.display = 'block';
  document.getElementById('outputWrap').scrollIntoView({ behavior: 'smooth' });
}

function buildFallback(selected, niche) {
  return {
    subject_line: 'Lo que mueve ' + niche.label + ' hoy',
    preheader: 'Tendencias y datos · PEDRI',
    intro_blurb: 'El sector ' + niche.label + ' se mueve. Aquí las señales que importan esta semana.',
    posts: selected.map((t, i) => ({
      wp_title:    t.title.slice(0, 65),
      wp_excerpt:  'Una tendencia clave en ' + niche.label + ' que está redefiniendo el panorama.',
      wp_content:  t.title + '. Movimiento relevante para ' + niche.audience + '. Analiza el contexto y toma acción.',
      wp_category: niche.categories[i % niche.categories.length],
      snip_title:  t.title.slice(0, 60),
      snip_body:   'Señal importante en ' + niche.label + '. Analizamos el impacto y qué debes hacer.',
      source: t.source,
    })),
  };
}

// ═══ RENDER ═══
function renderOutput(data, niche) {
  renderBlogPosts();
  renderNewsletter(data, niche);
  if (wpConfig.wp_url) document.getElementById('wpDomain').textContent = '→ ' + wpConfig.wp_url;
}

function renderBlogPosts() {
  const list = document.getElementById('postsList');
  list.innerHTML = '';
  generatedPosts.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'post-item'; el.id = 'pi-' + i;
    el.style.animationDelay = (i * 0.05) + 's';
    el.innerHTML = '<div class="post-num">0' + (i+1) + '</div><div><div class="post-cat">' + p.wp_category + '</div><div class="post-title-out">' + p.wp_title + '</div><div class="post-excerpt-out">' + p.wp_excerpt + '</div></div><div class="post-status s-pending" id="ps-' + i + '"><span class="s-dot"></span>Pendiente</div>';
    list.appendChild(el);
  });
}

function setPostStatus(i, cls, label) {
  const el = document.getElementById('ps-' + i);
  if (el) { el.className = 'post-status ' + cls; el.innerHTML = '<span class="s-dot"></span>' + label; }
}

function renderNewsletter(data, niche) {
  const subject = data.subject_line || '';
  document.getElementById('emailSubjectPill').textContent = 'Asunto: ' + subject;
  document.getElementById('nlSubject').textContent = subject;
  const snips = (data.posts || []).map(p => '<div class="em-snip"><div class="em-snip-src">' + p.source + '</div><div class="em-snip-h">' + p.snip_title + '</div><div class="em-snip-p">' + p.snip_body + '</div><a href="#" class="em-snip-cta">Leer más</a></div>').join('');
  const nicheLabel = niche ? niche.label : '';
  document.getElementById('emailPreview').innerHTML = '<div class="em-outer"><div class="em-topbar"></div><div class="em-header"><div class="em-logo">PEDRI</div><div class="em-tagline">' + nicheLabel + '</div><div class="em-dateline">' + todayFormatted() + '</div></div><div class="em-introbelt"><p>' + data.intro_blurb + '</p></div><div class="em-subject">' + subject + '</div><div class="em-preheader">' + data.preheader + '</div><div class="em-divider"></div><div class="em-snippets">' + snips + '</div><div class="em-footer"><div class="em-footer-logo">PEDRI</div><p>Recibes esto porque te suscribiste a PEDRI<br><a href="#">Cancelar suscripción</a> · <a href="#">Ver en navegador</a></p></div></div>';
}

// ═══ WORDPRESS ═══
async function publishAll() {
  if (!wpConfig.wp_url) { showToast('Primero configura WordPress', true); openWPModal(); return; }
  const btn = document.getElementById('publishBtn');
  setLoading(btn, true);
  generatedPosts.forEach((_, i) => setPostStatus(i, 's-pending', '⟳ Publicando...'));
  try {
    const res = await publishToWP(
      generatedPosts.map(p => ({ title: p.wp_title, content: '<p>' + p.wp_content + '</p>', excerpt: p.wp_excerpt })),
      { wp_url: wpConfig.wp_url, wp_user: wpConfig.wp_user, wp_password: wpConfig.wp_password }
    );
    res.results.forEach((r, i) => r.ok ? setPostStatus(i, 's-published', '✓ #' + r.id) : setPostStatus(i, 's-error', '✕ ' + r.error));
    const ok = res.results.filter(r => r.ok).length, err = res.results.filter(r => !r.ok).length;
    showToast(err ? ok + ' publicados · ' + err + ' errores' : '✓ ' + ok + ' posts publicados', err > 0);
  } catch(e) {
    generatedPosts.forEach((_, i) => setPostStatus(i, 's-error', '✕ Error'));
    showToast('Error: ' + e.message, true);
  }
  setLoading(btn, false);
}

// ═══ EXPORT HTML ═══
function buildExportHTML() {
  if (!generatedNL) return '';
  const data = generatedNL, niche = data._niche || { label: '' }, today = todayFormatted();
  const snips = (data.posts || []).map(p => '<tr><td style="padding:18px 32px;border-bottom:1px solid #e8e4dc;"><p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#888;margin:0 0 5px">&#9658; ' + p.source + '</p><h2 style="font-family:Arial,sans-serif;font-weight:900;font-size:16px;color:#1a1916;line-height:1.3;margin:0 0 8px">' + p.snip_title + '</h2><p style="font-family:Georgia,serif;font-size:13px;color:#444;line-height:1.7;margin:0 0 10px">' + p.snip_body + '</p><a href="#" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#a8840b;letter-spacing:1px;text-transform:uppercase;text-decoration:none">Leer más &#8594;</a></td></tr>').join('');
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + data.subject_line + '</title></head><body style="margin:0;padding:0;background:#e8e4dc;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8e4dc;"><tr><td align="center" style="padding:24px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#f7f4ef;max-width:600px;width:100%;"><tr><td style="background:#1a1916;height:4px;font-size:0;">&nbsp;</td></tr><tr><td style="background:#1a1916;padding:28px 32px 22px;text-align:center;"><p style="font-family:Arial,sans-serif;font-weight:900;font-size:18px;color:#c49a0e;letter-spacing:4px;text-transform:uppercase;margin:0">PEDRI</p><p style="font-family:Georgia,serif;font-size:11px;color:#888;font-style:italic;margin:4px 0 0">' + niche.label + '</p><p style="font-family:Arial,sans-serif;font-size:10px;color:#777;letter-spacing:2px;text-transform:uppercase;margin:8px 0 0">' + today + '</p></td></tr><tr><td style="background:#c49a0e;padding:14px 32px;text-align:center;"><p style="font-family:Georgia,serif;font-size:13px;color:#1a1a0a;font-style:italic;line-height:1.6;margin:0">' + data.intro_blurb + '</p></td></tr><tr><td style="font-family:Arial,sans-serif;font-weight:900;font-size:18px;color:#1a1916;text-align:center;padding:22px 32px 6px;line-height:1.3">' + data.subject_line + '</td></tr><tr><td style="font-family:Georgia,serif;font-size:12px;color:#888;text-align:center;padding:0 32px 18px;font-style:italic">' + data.preheader + '</td></tr><tr><td style="padding:0 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #ddd;height:0;font-size:0;">&nbsp;</td></tr></table></td></tr><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + snips + '</table><tr><td style="background:#1a1916;padding:22px 32px;text-align:center;"><p style="font-family:Arial,sans-serif;font-weight:900;font-size:13px;color:#c49a0e;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px">PEDRI</p><p style="font-family:Georgia,serif;font-size:11px;color:#555;line-height:1.8;margin:0">Recibes esto porque te suscribiste a PEDRI<br><a href="#" style="color:#888;text-decoration:none">Cancelar suscripci&oacute;n</a> &nbsp;&middot;&nbsp; <a href="#" style="color:#888;text-decoration:none">Ver en navegador</a></p></td></tr></table></td></tr></table></body></html>';
}

async function doCopyHTML() {
  const html = buildExportHTML();
  if (!html) { showToast('Primero genera la newsletter', true); return; }
  await copyToClipboard(html);
  showToast('✓ HTML copiado — pégalo en tu ESP');
}

function openSrcModal() {
  const html = buildExportHTML();
  if (!html) { showToast('Primero genera la newsletter', true); return; }
  document.getElementById('codeBlock').textContent = html;
  document.getElementById('srcModal').classList.add('open');
}

// ═══ WP MODAL ═══
function openWPModal() {
  document.getElementById('wpUrl').value     = wpConfig.wp_url     || '';
  document.getElementById('wpUser').value    = wpConfig.wp_user    || '';
  document.getElementById('wpAppPass').value = wpConfig.wp_password || '';
  document.getElementById('wpTestResult').className = 'wp-test-result';
  document.getElementById('wpModal').classList.add('open');
}

async function testWP() {
  const btn = document.getElementById('testWPBtn'), result = document.getElementById('wpTestResult');
  setLoading(btn, true); result.className = 'wp-test-result';
  const cfg = { wp_url: document.getElementById('wpUrl').value.trim().replace(//$/, ''), wp_user: document.getElementById('wpUser').value.trim(), wp_password: document.getElementById('wpAppPass').value.trim() };
  try {
    const data = await testWPConnection(cfg);
    result.className = 'wp-test-result ' + (data.ok ? 'ok' : 'err');
    result.textContent = data.ok ? '✓ Conectado como "' + data.wp_user + '"' : '✕ ' + data.error;
  } catch(e) { result.className = 'wp-test-result err'; result.textContent = '✕ Error: ' + e.message; }
  setLoading(btn, false);
}

function saveWP() {
  wpConfig = { wp_url: document.getElementById('wpUrl').value.trim().replace(//$/, ''), wp_user: document.getElementById('wpUser').value.trim(), wp_password: document.getElementById('wpAppPass').value.trim() };
  try { sessionStorage.setItem('pd_wp', JSON.stringify(wpConfig)); } catch(e) {}
  closeModal('wpModal');
  if (wpConfig.wp_url) document.getElementById('wpDomain').textContent = '→ ' + wpConfig.wp_url;
  showToast('✓ WordPress configurado');
}

// ═══ UTILS ═══
function sourceToBadge(s) {
  s = (s || '').toLowerCase();
  if (s.includes('twitter') || s === 'x') return 'badge-x';
  if (s.includes('reddit'))               return 'badge-reddit';
  if (s.includes('linkedin'))             return 'badge-linkedin';
  return 'badge-news';
}
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function closeModal(id)      { document.getElementById(id).classList.remove('open'); }
function closeOverlay(e, id) { if (e.target.id === id) closeModal(id); }
function setLoading(btn, on) { btn.disabled = on; btn.classList.toggle('is-loading', on); }
