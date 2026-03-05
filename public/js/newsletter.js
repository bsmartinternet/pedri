/* newsletter.js - PEDRI v6 */
/* Scan real con web search para todos los nichos */
'use strict';

var LANGUAGES = {
  'es': { label: 'ES', promptLang: 'en castellano' },
  'en': { label: 'EN', promptLang: 'in English' },
  'it': { label: 'IT', promptLang: 'in italiano' },
  'fr': { label: 'FR', promptLang: 'en francais' },
  'de': { label: 'DE', promptLang: 'auf Deutsch' },
  'nl': { label: 'NL', promptLang: 'in het Nederlands' },
  'be': { label: 'BE', promptLang: 'en francais (Belgique)' },
};

var NICHES = {
  'email-marketing': { label: 'Email Marketing',    categories: ['Strategy','Deliverability','AI & Email','Trends','Tools'],           audience: 'email marketing professionals B2B and B2C',              tone: 'expert, data-driven, actionable' },
  'ia-tecnologia':   { label: 'AI & Technology',    categories: ['Generative AI','Tools','Industry','Research','Productivity'],        audience: 'tech professionals, developers and AI enthusiasts',       tone: 'technical but accessible, practical cases' },
  'ecommerce':       { label: 'eCommerce & Retail', categories: ['Conversion','Logistics','AI & Retail','Trends','Platforms'],         audience: 'ecommerce directors and online store managers',           tone: 'practical, conversion-focused, business results' },
  'marketing-digital': { label: 'Digital Marketing', categories: ['SEO','Paid Media','Content','Social','Analytics'],                  audience: 'digital marketers, growth hackers and CMOs',             tone: 'strategic, data-driven, real campaign examples' },
  'startups':        { label: 'Startups & Business',categories: ['Funding','Product','Growth','Culture','Market'],                     audience: 'founders, investors and startup professionals',           tone: 'direct, inspiring, no corporate fluff' },
  'finanzas':        { label: 'Finance & Economy',  categories: ['Markets','Macro','Investment','Crypto','Fintech'],                   audience: 'investors, analysts and finance professionals',           tone: 'analytical, rigorous, macro context, actionable' },
  'salud':           { label: 'Health & Wellness',  categories: ['Research','Nutrition','Mental Health','Health Tech','Lifestyle'],    audience: 'health enthusiasts and healthcare professionals',         tone: 'approachable, evidence-based, practical' },
  'viajes':          { label: 'Travel & Tourism',   categories: ['Destinations','Trends','Travel Tech','Sustainability','Remote Work'],audience: 'frequent travelers, digital nomads, tourism pros',        tone: 'inspiring, practical tips, experienced traveler' },
  'deporte':         { label: 'Sport & Fitness',    categories: ['Training','Sports Nutrition','Technology','Competition','Recovery'], audience: 'athletes, coaches and fitness professionals',             tone: 'motivating, science-based, direct' },
  'sostenibilidad':  { label: 'Sustainability',     categories: ['Climate','Circular Economy','Energy','Business','Policy'],           audience: 'sustainability pros and conscious consumers',             tone: 'constructive, data-driven, no greenwashing' },
};

// === STATE ===
var selectedIds    = new Set();
var generatedPosts = [];
var generatedNL    = null;
var wpConfig       = {};
var currentTopics  = [];

try { var _s = sessionStorage.getItem('pd_wp'); if (_s) wpConfig = JSON.parse(_s); } catch(e) {}
fetch('/auth/me').then(function(r){ return r.json(); }).then(function(d){
  if (d.authenticated) document.getElementById('sidebarUser').textContent = d.user;
});

// === NICHE / LANG ===
function getCurrentNiche() {
  var sel = document.getElementById('nicheSelect');
  if (!sel) return NICHES['email-marketing'];
  var val = sel.value;
  if (val === 'custom') {
    var customEl = document.getElementById('nicheCustom');
    var label = (customEl ? customEl.value : '').trim() || 'Custom';
    return { label: label, audience: 'people interested in ' + label, tone: 'informative with practical data', categories: ['Trends','Analysis','Tips','News'] };
  }
  return NICHES[val] || NICHES['email-marketing'];
}

function getCurrentLang() {
  var sel = document.getElementById('langSelect');
  return LANGUAGES[sel ? sel.value : 'es'] || LANGUAGES['es'];
}

function onNicheChange() {
  var sel = document.getElementById('nicheSelect');
  var val = sel ? sel.value : '';
  var c = document.getElementById('nicheCustom');
  if (c) c.style.display = val === 'custom' ? 'block' : 'none';
  resetResults();
}

function onLangChange() { resetResults(); }

function resetResults() {
  selectedIds.clear(); currentTopics = [];
  document.getElementById('topicsWrap').style.display = 'none';
  document.getElementById('outputWrap').style.display = 'none';
  document.getElementById('actionBar').classList.remove('visible');
}

// === SCAN — web search for ALL niches ===
// Uses Anthropic web_search tool via the proxy endpoint.
// Always fetches real trending posts/threads from today.
function scanTopics() {
  var btn = document.getElementById('scanBtn');
  setLoading(btn, true);
  selectedIds.clear();
  scanWithWebSearch()
    .then(function(){ setLoading(btn, false); })
    .catch(function(e){ console.error(e); setLoading(btn, false); showToast('Scan error - check console', true); });
}

function scanWithWebSearch() {
  var niche = getCurrentNiche();
  var lang  = getCurrentLang();
  var today = todayFormatted();

  var systemPrompt = 'You are a research assistant that finds real trending news and posts. Always search the web before answering. Return only valid JSON, no backticks, no explanation.';

  var userPrompt = 'Search the web right now and find 7 real trending news articles, posts or threads about "' + niche.label + '" published in the last 48 hours. Today is ' + today + '.\n\nFor each item return:\n- The exact headline as published\n- The platform or media outlet (e.g. Reddit, X/Twitter, BBC, TechCrunch, etc)\n- The exact URL of that specific article, post or thread (NOT the homepage)\n- Realistic engagement metric (views, upvotes, shares, etc)\n- Sentiment: Positive, Negative or Mixed\n\nWrite all titles ' + lang.promptLang + '.\n\nReturn ONLY this JSON structure, no backticks:\n{"topics":[{"title":"exact headline","source":"platform or outlet","sourceUrl":"https://exact-url","engagement":"e.g. 2.3K upvotes","sent":"Positive","sentClass":"sent-up"}]}\n\nsentClass must be sent-up, sent-down or sent-mix. Include only items with real verifiable URLs.';

  return callAI(
    [{ role: 'user', content: userPrompt }],
    systemPrompt,
    1200,
    true,  // use web_search tool
    true   // use fast model (haiku) — scan/classify task
  ).then(function(text) {
    var clean = text.replace(/```json|```/g, '').trim();
    // Extract JSON if there's surrounding text
    var jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) clean = jsonMatch[0];
    var data = JSON.parse(clean);
    currentTopics = (data.topics || []).map(function(t, i) {
      return Object.assign({}, t, { id: i + 1, badge: sourceToBadge(t.source) });
    });
    if (currentTopics.length === 0) throw new Error('No topics returned');
    showTopics(niche);
  }).catch(function(e) {
    console.error('Web search scan failed:', e);
    showToast('Could not fetch live topics — try again', true);
    setLoading(document.getElementById('scanBtn'), false);
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
    // Source: always visible. Clickable link if URL available.
    var sourceHtml = t.sourceUrl
      ? '<a href="' + t.sourceUrl + '" target="_blank" rel="noopener" class="topic-source-link">' + t.source + ' &nearr;</a>'
      : '<span class="topic-source-text">' + t.source + '</span>';
    el.innerHTML =
      '<div class="topic-row1">'
        + '<span class="source-badge ' + t.badge + '">' + t.source + '</span>'
        + '<span class="topic-engagement">' + t.engagement + '</span>'
        + '<div class="topic-check">&#10003;</div>'
      + '</div>'
      + '<div class="topic-title">' + t.title + '</div>'
      + '<div class="topic-footer">'
        + '<span class="' + t.sentClass + '">' + t.sent + '</span>'
        + sourceHtml
      + '</div>';
    el.onclick = function(e) {
      if (e.target.tagName === 'A') return;
      toggleTopic(t.id, el);
    };
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
  var lang     = getCurrentLang();
  var selected = currentTopics.filter(function(t){ return selectedIds.has(t.id); });
  var topicsList = selected.map(function(t){ return '- "' + t.title + '" [' + t.source + ', ' + t.engagement + ']'; }).join('\n');
  var cats = niche.categories.join(', ');
  var prompt = 'You are a content strategist expert in ' + niche.label + '. Audience: ' + niche.audience + '. Today is ' + todayFormatted() + '.\n\nWith these real trending topics from today, generate blog posts and newsletter snippets:\n\n' + topicsList + '\n\nTone: ' + niche.tone + '. Blog categories to use: ' + cats + '.\nWrite ALL content ' + lang.promptLang + '.\n\nReturn ONLY valid JSON, no backticks:\n{"subject_line":"Email subject max 50 chars no emojis","preheader":"Preheader max 90 chars","intro_blurb":"Newsletter opening 1-2 lines agile tone","posts":[{"wp_title":"SEO title max 65 chars","wp_excerpt":"Excerpt 2-3 sentences","wp_content":"4-5 sentences: context + data + impact + actionable recommendation","wp_category":"one of: ' + cats + '","snip_title":"Newsletter headline max 60 chars","snip_body":"2-3 sentences: data point > impact > action","source":"source name"}]}';
  callAI([{ role: 'user', content: prompt }], null, 2000, false, false) // sonnet — content generation
    .then(function(text) {
      var clean = text.replace(/```json|```/g, '').trim();
      var jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) clean = jsonMatch[0];
      var data = JSON.parse(clean);
      generatedNL    = Object.assign({}, data, { _niche: niche, _lang: lang });
      generatedPosts = (data.posts || []).map(function(p, i){ return Object.assign({}, p, { _idx: i, _status: 'pending' }); });
      renderOutput(data, niche);
    })
    .catch(function(err) {
      console.error(err);
      var fallback = buildFallback(selected, niche);
      generatedNL    = Object.assign({}, fallback, { _niche: niche, _lang: lang });
      generatedPosts = fallback.posts.map(function(p, i){ return Object.assign({}, p, { _idx: i, _status: 'pending' }); });
      renderOutput(fallback, niche);
      showToast('AI unavailable - example content used', true);
    })
    .finally(function() {
      setLoading(btn, false);
      document.getElementById('outputWrap').style.display = 'block';
      document.getElementById('outputWrap').scrollIntoView({ behavior: 'smooth' });
    });
}

function buildFallback(selected, niche) {
  return {
    subject_line: 'What is moving ' + niche.label + ' today',
    preheader:    'Trends and data - PEDRI',
    intro_blurb:  niche.label + ' is moving. Key signals for this week.',
    posts: selected.map(function(t, i) { return {
      wp_title:    t.title.slice(0, 65),
      wp_excerpt:  'A key trend in ' + niche.label + ' redefining the landscape.',
      wp_content:  t.title + '. Relevant context for ' + niche.audience + '. Analyze and act.',
      wp_category: niche.categories[i % niche.categories.length],
      snip_title:  t.title.slice(0, 60),
      snip_body:   'Key signal in ' + niche.label + '. Impact and what to do this week.',
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
    el.innerHTML = '<div class="post-num">0' + (i+1) + '</div><div><div class="post-cat">' + p.wp_category + '</div><div class="post-title-out">' + p.wp_title + '</div><div class="post-excerpt-out">' + p.wp_excerpt + '</div></div><div class="post-status s-pending" id="ps-' + i + '"><span class="s-dot"></span>Pending</div>';
    list.appendChild(el);
  });
}

function setPostStatus(i, cls, label) {
  var el = document.getElementById('ps-' + i);
  if (el) { el.className = 'post-status ' + cls; el.innerHTML = '<span class="s-dot"></span>' + label; }
}

// Preview = snippets only. Same as export.
function renderNewsletter(data, niche) {
  var subject = data.subject_line || '';
  document.getElementById('emailSubjectPill').textContent = 'Subject: ' + subject;
  document.getElementById('nlSubject').textContent = subject;
  var snips = (data.posts || []).map(function(p) {
    return '<div class="em-snip">'
      + '<div class="em-snip-h">' + p.snip_title + '</div>'
      + '<div class="em-snip-p">' + p.snip_body + '</div>'
      + '<a href="#" class="em-snip-cta">Read more &rarr;</a>'
      + '</div>';
  }).join('');
  document.getElementById('emailPreview').innerHTML =
    '<div class="em-outer em-outer--snippets">'
    + '<div class="em-snippets">' + snips + '</div>'
    + '</div>';
}

// === WORDPRESS ===
function publishAll() {
  if (!wpConfig.wp_url) { showToast('Configure WordPress first', true); openWPModal(); return; }
  var btn = document.getElementById('publishBtn');
  setLoading(btn, true);
  generatedPosts.forEach(function(_, i){ setPostStatus(i, 's-pending', 'Publishing...'); });
  publishToWP(
    generatedPosts.map(function(p){ return { title: p.wp_title, content: '<p>' + p.wp_content + '</p>', excerpt: p.wp_excerpt }; }),
    { wp_url: wpConfig.wp_url, wp_user: wpConfig.wp_user, wp_password: wpConfig.wp_password }
  ).then(function(res) {
    res.results.forEach(function(r, i) {
      if (r.ok) setPostStatus(i, 's-published', 'Published #' + r.id);
      else      setPostStatus(i, 's-error', 'Error: ' + r.error);
    });
    var ok  = res.results.filter(function(r){ return r.ok; }).length;
    var err = res.results.filter(function(r){ return !r.ok; }).length;
    showToast(err ? ok + ' published, ' + err + ' errors' : ok + ' posts published', err > 0);
  }).catch(function(e) {
    generatedPosts.forEach(function(_, i){ setPostStatus(i, 's-error', 'Error'); });
    showToast('Error: ' + e.message, true);
  }).finally(function(){ setLoading(btn, false); });
}

// === EXPORT HTML ===
// Snippets block only — no header, no footer. Paste after your branded header.
function buildExportHTML() {
  if (!generatedNL) return '';
  var snips = (generatedNL.posts || []).map(function(p) {
    return '<tr><td style="padding:18px 32px;border-bottom:1px solid #e8e4dc;">'
      + '<h2 style="font-family:Arial,sans-serif;font-weight:900;font-size:16px;color:#1a1916;line-height:1.3;margin:0 0 8px">' + p.snip_title + '</h2>'
      + '<p style="font-family:Georgia,serif;font-size:13px;color:#444;line-height:1.7;margin:0 0 10px">' + p.snip_body + '</p>'
      + '<a href="#" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#a8840b;letter-spacing:1px;text-transform:uppercase;text-decoration:none">Read more &rarr;</a>'
      + '</td></tr>';
  }).join('');
  return '<!-- PEDRI snippets — paste after your header, before your footer -->\n'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f4ef;">\n'
    + snips
    + '\n</table>\n'
    + '<!-- /PEDRI snippets -->';
}

function doCopyHTML() {
  var html = buildExportHTML();
  if (!html) { showToast('Generate newsletter first', true); return; }
  copyToClipboard(html).then(function(){ showToast('Snippets HTML copied - paste after your header'); });
}

function openSrcModal() {
  var html = buildExportHTML();
  if (!html) { showToast('Generate newsletter first', true); return; }
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
    result.textContent = data.ok ? 'Connected as "' + data.wp_user + '"' : 'Error: ' + data.error;
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
  showToast('WordPress configured');
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