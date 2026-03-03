/* newsletter.js — lógica completa de la herramienta Newsletter IA */
'use strict';

// ─── DATOS DE TOPICS (en producción vendrían del backend / APIs externas) ───
const TOPICS = [
  { id:1, title:"La IA generativa reduce costes de email marketing un 60% según nuevo estudio", source:"X / Twitter", badge:"badge-x", engagement:"24.2K menciones", sent:"↑ Positivo", sentClass:"sent-up" },
  { id:2, title:"Reddit debate: ¿el email marketing ha muerto con las restricciones de Gmail 2026?", source:"Reddit", badge:"badge-reddit", engagement:"1.8K upvotes", sent:"→ Mixto", sentClass:"sent-mix" },
  { id:3, title:"Open rates B2B caen al 19%: análisis de qué está fallando", source:"Marketing News", badge:"badge-news", engagement:"340 shares", sent:"↓ Negativo", sentClass:"sent-down" },
  { id:4, title:"Personalización con LLMs: casos reales de +45% conversión en nurturing", source:"LinkedIn", badge:"badge-linkedin", engagement:"8.9K impressions", sent:"↑ Positivo", sentClass:"sent-up" },
  { id:5, title:"Google anuncia nuevas restricciones DMARC que afectarán a todos los ESPs en Q2", source:"X / Twitter", badge:"badge-x", engagement:"18.5K menciones", sent:"↓ Negativo", sentClass:"sent-down" },
  { id:6, title:"A/B testing de subject lines con IA: +34% CTR en campaña real documentada", source:"Marketing News", badge:"badge-news", engagement:"220 shares", sent:"↑ Positivo", sentClass:"sent-up" },
  { id:7, title:"El resurgir del email plain-text: por qué las marcas de lujo abandonan el HTML", source:"Reddit", badge:"badge-reddit", engagement:"2.4K upvotes", sent:"→ Mixto", sentClass:"sent-mix" },
  { id:8, title:"Automatización de lead nurturing en frío: flujos que convierten en B2B 2026", source:"LinkedIn", badge:"badge-linkedin", engagement:"12K impressions", sent:"↑ Positivo", sentClass:"sent-up" },
  { id:9, title:"Inboxroad lanza nuevas APIs de warmup automático para remitentes", source:"Marketing News", badge:"badge-news", engagement:"180 shares", sent:"↑ Positivo", sentClass:"sent-up" },
];

// ─── ESTADO ───
let selectedIds = new Set();
let generatedPosts = [];
let generatedNL = null;
let wpConfig = {};

// Cargar WP config guardada en sessionStorage
try {
  const saved = sessionStorage.getItem('pd_wp');
  if (saved) wpConfig = JSON.parse(saved);
} catch(e) {}

// Cargar usuario en sidebar
fetch('/auth/me').then(r => r.json()).then(d => {
  if (d.authenticated) document.getElementById('sidebarUser').textContent = d.user;
});

// ─── SCAN ───
function scanTopics() {
  const btn = document.getElementById('scanBtn');
  setLoading(btn, true);

  setTimeout(() => {
    setLoading(btn, false);

    document.getElementById('topicsWrap').style.display = 'block';
    document.getElementById('topicCount').textContent = TOPICS.length;
    renderTopics();

    document.getElementById('topicsWrap').scrollIntoView({ behavior:'smooth', block:'start' });
  }, 1200);
}

function renderTopics() {
  const grid = document.getElementById('topicsGrid');
  grid.innerHTML = '';

  TOPICS.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'topic-card' + (selectedIds.has(t.id) ? ' selected' : '');
    el.style.animationDelay = `${i * 0.04}s`;
    el.innerHTML = `
      <div class="topic-row1">
        <span class="source-badge ${t.badge}">${t.source}</span>
        <span class="topic-engagement">${t.engagement}</span>
        <div class="topic-check">✓</div>
      </div>
      <div class="topic-title">${t.title}</div>
      <div class="topic-meta"><span class="${t.sentClass}">${t.sent}</span></div>
    `;
    el.onclick = () => toggleTopic(t.id, el);
    grid.appendChild(el);
  });
}

function toggleTopic(id, el) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
    el.classList.remove('selected');
  } else {
    selectedIds.add(id);
    el.classList.add('selected');
  }
  updateActionBar();
}

function updateActionBar() {
  const bar = document.getElementById('actionBar');
  document.getElementById('selectedCount').textContent = selectedIds.size;
  bar.classList.toggle('visible', selectedIds.size > 0);
}

function clearSelection() {
  selectedIds.clear();
  document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
  updateActionBar();
}

// ─── GENERATE ───
async function generateAll() {
  if (selectedIds.size === 0) return;

  const btn = document.getElementById('generateBtn');
  setLoading(btn, true);

  const selected = TOPICS.filter(t => selectedIds.has(t.id));
  const topicsList = selected.map(t => `- "${t.title}" [${t.source}, ${t.engagement}]`).join('\n');

  const prompt = `Eres el content strategist de una empresa de email marketing B2B llamada Pedri. Hoy es ${todayFormatted()}.

Con estos trending topics, genera contenido para publicar en blog y newsletter diaria:

${topicsList}

Responde SOLO con JSON válido (sin backticks, sin texto extra):
{
  "subject_line": "Subject del email, máx 50 chars, impacto inmediato, sin emojis",
  "preheader": "Preheader, máx 90 chars",
  "intro_blurb": "Frase apertura newsletter 1-2 líneas, directo e informal estilo The Hustle",
  "posts": [
    {
      "wp_title": "Título SEO para WordPress, máx 65 chars",
      "wp_excerpt": "Extracto 2-3 frases con insight clave",
      "wp_content": "Contenido del post 4-5 frases con datos y recomendación accionable",
      "wp_category": "Categoría 1-2 palabras",
      "snip_title": "Titular newsletter máx 60 chars, estilo The Hustle",
      "snip_body": "2-3 frases: dato > impacto > qué hacer. Tono ágil.",
      "source": "nombre fuente"
    }
  ]
}`;

  try {
    const text = await callAI([{ role: 'user', content: prompt }], null, 2000);
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    generatedNL = data;
    generatedPosts = (data.posts || []).map((p, i) => ({ ...p, _idx: i, _status: 'pending' }));
    renderOutput(data);

  } catch(err) {
    console.error(err);
    // Fallback sin bloquear
    const fallback = buildFallback(selected);
    generatedNL = fallback;
    generatedPosts = fallback.posts.map((p, i) => ({ ...p, _idx: i, _status: 'pending' }));
    renderOutput(fallback);
    showToast('IA no disponible — usando contenido de ejemplo', true);
  }

  setLoading(btn, false);
  document.getElementById('outputWrap').style.display = 'block';
  document.getElementById('outputWrap').scrollIntoView({ behavior:'smooth' });
}

function buildFallback(selected) {
  return {
    subject_line: "Lo que mueve el email marketing hoy",
    preheader: "Tendencias, datos y lo que tienes que hacer · Pedri",
    intro_blurb: "El sector se mueve. Aquí las señales que importan esta semana.",
    posts: selected.map((t, i) => ({
      wp_title: t.title.slice(0, 65),
      wp_excerpt: "Una tendencia clave que está redefiniendo las campañas de email.",
      wp_content: `${t.title}. Este movimiento tiene implicaciones directas en la forma de planificar campañas. Revisa tus métricas actuales.`,
      wp_category: ["IA & Email", "Estrategia", "Deliverability", "Tendencias"][i % 4],
      snip_title: t.title.slice(0, 60),
      snip_body: "Señal importante del sector. Analizamos el impacto y qué debes hacer esta semana.",
      source: t.source,
    }))
  };
}

// ─── RENDER OUTPUT ───
function renderOutput(data) {
  renderBlogPosts();
  renderNewsletter(data);

  // WP domain hint
  if (wpConfig.wp_url) {
    document.getElementById('wpDomain').textContent = `→ ${wpConfig.wp_url}`;
  }
}

function renderBlogPosts() {
  const list = document.getElementById('postsList');
  list.innerHTML = '';
  generatedPosts.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'post-item';
    el.id = `pi-${i}`;
    el.style.animationDelay = `${i * 0.05}s`;
    el.innerHTML = `
      <div class="post-num">0${i + 1}</div>
      <div>
        <div class="post-cat">${p.wp_category || 'Email Marketing'}</div>
        <div class="post-title-out">${p.wp_title}</div>
        <div class="post-excerpt-out">${p.wp_excerpt}</div>
      </div>
      <div class="post-status s-pending" id="ps-${i}">
        <span class="s-dot"></span>Pendiente
      </div>
    `;
    list.appendChild(el);
  });
}

function setPostStatus(i, cls, label) {
  const el = document.getElementById(`ps-${i}`);
  if (!el) return;
  el.className = `post-status ${cls}`;
  el.innerHTML = `<span class="s-dot"></span>${label}`;
}

// ─── WORDPRESS PUBLISH ───
async function publishAll() {
  if (!wpConfig.wp_url) {
    showToast('Primero configura WordPress →', true);
    openWPModal();
    return;
  }

  const btn = document.getElementById('publishBtn');
  setLoading(btn, true);

  const posts = generatedPosts.map(p => ({
    title:   p.wp_title,
    content: `<p>${p.wp_content}</p>`,
    excerpt: p.wp_excerpt,
  }));

  // Actualiza estados a "publicando"
  generatedPosts.forEach((_, i) => setPostStatus(i, 's-pending', '⟳ Publicando...'));

  try {
    const res = await publishToWP(posts, {
      wp_url:      wpConfig.wp_url,
      wp_user:     wpConfig.wp_user,
      wp_password: wpConfig.wp_password,
    });

    res.results.forEach((r, i) => {
      if (r.ok) setPostStatus(i, 's-published', `✓ #${r.id}`);
      else      setPostStatus(i, 's-error', `✕ ${r.error}`);
    });

    const ok = res.results.filter(r => r.ok).length;
    const err = res.results.filter(r => !r.ok).length;
    showToast(err ? `${ok} publicados · ${err} errores` : `✓ ${ok} posts publicados en WordPress`, err > 0);

  } catch(e) {
    generatedPosts.forEach((_, i) => setPostStatus(i, 's-error', '✕ Error'));
    showToast(`Error de conexión: ${e.message}`, true);
  }

  setLoading(btn, false);
}

// ─── NEWSLETTER RENDER ───
function renderNewsletter(data) {
  const subject = data.subject_line || '';
  document.getElementById('emailSubjectPill').textContent = `Asunto: ${subject}`;
  document.getElementById('nlSubject').textContent = subject;

  const snippetsHTML = (data.posts || []).map(p => `
    <div class="em-snip">
      <div class="em-snip-src">${p.source}</div>
      <div class="em-snip-h">${p.snip_title}</div>
      <div class="em-snip-p">${p.snip_body}</div>
      <a href="#" class="em-snip-cta">Leer más</a>
    </div>
  `).join('');

  const today = todayFormatted();

  document.getElementById('emailPreview').innerHTML = `
    <div class="em-outer">
      <div class="em-topbar"></div>
      <div class="em-header">
        <div class="em-logo">Pedri</div>
        <div class="em-tagline">Email Marketing Intelligence</div>
        <div class="em-dateline">${today}</div>
      </div>
      <div class="em-introbelt"><p>${data.intro_blurb}</p></div>
      <div class="em-subject">${subject}</div>
      <div class="em-preheader">${data.preheader}</div>
      <div class="em-divider"></div>
      <div class="em-snippets">${snippetsHTML}</div>
      <div class="em-footer">
        <div class="em-footer-logo">Pedri</div>
        <p>Recibes esto porque te suscribiste a Pedri<br>
        <a href="#">Cancelar suscripción</a> · <a href="#">Ver en navegador</a></p>
      </div>
    </div>
  `;
}

// ─── EXPORTAR HTML LIMPIO (table-based, compatible con ESPs) ───
function buildExportHTML() {
  if (!generatedNL) return '';
  const data = generatedNL;
  const today = todayFormatted();

  const snippets = (data.posts || []).map(p => `
    <tr>
      <td style="padding:18px 32px;border-bottom:1px solid #e8e4dc;">
        <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#888;margin:0 0 5px">&#9658; ${p.source}</p>
        <h2 style="font-family:Arial,sans-serif;font-weight:900;font-size:16px;color:#1a1a2e;line-height:1.3;margin:0 0 8px">${p.snip_title}</h2>
        <p style="font-family:Georgia,serif;font-size:13px;color:#444;line-height:1.7;margin:0 0 10px">${p.snip_body}</p>
        <a href="#" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#c8390a;letter-spacing:1px;text-transform:uppercase;text-decoration:none">Leer m&aacute;s &#8594;</a>
      </td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${data.subject_line}</title>
</head>
<body style="margin:0;padding:0;background:#e8e4dc;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8e4dc;">
<tr><td align="center" style="padding:24px 0;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#f7f4ef;max-width:600px;width:100%;">

    <!-- TOP BAR -->
    <tr><td style="background:#1a1a2e;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- HEADER -->
    <tr><td style="background:#1a1a2e;padding:28px 32px 22px;text-align:center;">
      <p style="font-family:Arial,sans-serif;font-weight:900;font-size:24px;color:#f0c040;letter-spacing:-0.5px;margin:0">Pedri</p>
      <p style="font-family:Georgia,serif;font-size:11px;color:#666;font-style:italic;margin:4px 0 0">Email Marketing Intelligence</p>
      <p style="font-family:Arial,sans-serif;font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase;margin:8px 0 0">${today}</p>
    </td></tr>

    <!-- INTRO BELT -->
    <tr><td style="background:#f0c040;padding:14px 32px;text-align:center;">
      <p style="font-family:Georgia,serif;font-size:13px;color:#1a1a0a;font-style:italic;line-height:1.6;margin:0">${data.intro_blurb}</p>
    </td></tr>

    <!-- SUBJECT + PREHEADER -->
    <tr><td style="font-family:Arial,sans-serif;font-weight:900;font-size:18px;color:#1a1a2e;text-align:center;padding:22px 32px 6px;line-height:1.3">${data.subject_line}</td></tr>
    <tr><td style="font-family:Georgia,serif;font-size:12px;color:#888;text-align:center;padding:0 32px 18px;font-style:italic">${data.preheader}</td></tr>

    <!-- DIVIDER -->
    <tr><td style="padding:0 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #ddd;height:0;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>

    <!-- SNIPPETS -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${snippets}
    </table>

    <!-- FOOTER -->
    <tr><td style="background:#1a1a2e;padding:22px 32px;text-align:center;">
      <p style="font-family:Arial,sans-serif;font-weight:900;font-size:14px;color:#f0c040;margin:0 0 8px">Pedri</p>
      <p style="font-family:Georgia,serif;font-size:11px;color:#555;line-height:1.8;margin:0">
        Recibes esto porque te suscribiste a Pedri<br>
        <a href="#" style="color:#888;text-decoration:none">Cancelar suscripci&oacute;n</a>
        &nbsp;&middot;&nbsp;
        <a href="#" style="color:#888;text-decoration:none">Ver en navegador</a>
      </p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

async function doCopyHTML() {
  const html = buildExportHTML();
  if (!html) { showToast('Primero genera la newsletter', true); return; }
  const ok = await copyToClipboard(html);
  if (ok) showToast('✓ HTML copiado — pégalo en tu ESP');
}

function openSrcModal() {
  const html = buildExportHTML();
  if (!html) { showToast('Primero genera la newsletter', true); return; }
  document.getElementById('codeBlock').textContent = html;
  document.getElementById('srcModal').classList.add('open');
}

// ─── WP CONFIG MODAL ───
function openWPModal() {
  document.getElementById('wpUrl').value    = wpConfig.wp_url || '';
  document.getElementById('wpUser').value   = wpConfig.wp_user || '';
  document.getElementById('wpAppPass').value = wpConfig.wp_password || '';
  document.getElementById('wpTestResult').className = 'wp-test-result';
  document.getElementById('wpModal').classList.add('open');
}

async function testWP() {
  const btn = document.getElementById('testWPBtn');
  const result = document.getElementById('wpTestResult');
  setLoading(btn, true);
  result.className = 'wp-test-result';

  const cfg = {
    wp_url:      document.getElementById('wpUrl').value.trim().replace(/\/$/, ''),
    wp_user:     document.getElementById('wpUser').value.trim(),
    wp_password: document.getElementById('wpAppPass').value.trim(),
  };

  try {
    const data = await testWPConnection(cfg);
    if (data.ok) {
      result.className = 'wp-test-result ok';
      result.textContent = `✓ Conectado como "${data.wp_user}" en ${data.wp_url}`;
    } else {
      result.className = 'wp-test-result err';
      result.textContent = `✕ ${data.error}`;
    }
  } catch(e) {
    result.className = 'wp-test-result err';
    result.textContent = `✕ Error de red: ${e.message}`;
  }

  setLoading(btn, false);
}

function saveWP() {
  wpConfig = {
    wp_url:      document.getElementById('wpUrl').value.trim().replace(/\/$/, ''),
    wp_user:     document.getElementById('wpUser').value.trim(),
    wp_password: document.getElementById('wpAppPass').value.trim(),
  };
  try { sessionStorage.setItem('pd_wp', JSON.stringify(wpConfig)); } catch(e) {}
  closeModal('wpModal');
  if (wpConfig.wp_url) document.getElementById('wpDomain').textContent = `→ ${wpConfig.wp_url}`;
  showToast('✓ WordPress configurado');
}

// ─── MODALS ───
function closeModal(id)      { document.getElementById(id).classList.remove('open'); }
function closeOverlay(e, id) { if (e.target.id === id) closeModal(id); }

// ─── HELPERS ───
function setLoading(btn, on) {
  btn.disabled = on;
  btn.classList.toggle('is-loading', on);
}
