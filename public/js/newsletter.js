/* newsletter.js - PEDRI v5.1 */
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

function getCurrentLang() {
  var sel = document.getElementById('langSelect');
  return LANGUAGES[sel ? sel.value : 'es'] || LANGUAGES['es'];
}

function onLangChange() {
  if (currentTopics.length > 0) resetResults();
}

// Topics in catalog have NO sourceUrl — they are example placeholders.
// Real sourceUrls only come from AI scan (custom niche), where Claude
// is prompted to return the actual URL of each specific post/thread.
var NICHES = {
  'email-marketing': {
    label: 'Email Marketing',
    audience: 'email marketing professionals, B2B and B2C',
    tone: 'expert, data-driven, actionable',
    categories: ['Strategy','Deliverability','AI & Email','Trends','Tools'],
    topics: [
      { title:'AI cuts email marketing costs 60% per new industry study', source:'X / Twitter', engagement:'24.2K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'B2B open rates fall to 19%: analysis of what is failing in 2026', source:'Reddit', engagement:'1.8K upvotes', sent:'Negative', sentClass:'sent-down' },
      { title:'LLM personalization: real cases showing +45% nurturing conversion', source:'LinkedIn', engagement:'8.9K impressions', sent:'Positive', sentClass:'sent-up' },
      { title:'Google announces new DMARC rules affecting all ESPs in Q2', source:'X / Twitter', engagement:'18.5K mentions', sent:'Negative', sentClass:'sent-down' },
      { title:'AI subject line A/B testing: +34% CTR in documented real campaign', source:'Marketing News', engagement:'220 shares', sent:'Positive', sentClass:'sent-up' },
      { title:'Plain-text email revival: why luxury brands are ditching HTML', source:'Reddit', engagement:'2.4K upvotes', sent:'Mixed', sentClass:'sent-mix' },
      { title:'Cold lead nurturing automation: flows that convert in B2B 2026', source:'LinkedIn', engagement:'12K impressions', sent:'Positive', sentClass:'sent-up' },
    ],
  },
  'ia-tecnologia': {
    label: 'AI & Technology',
    audience: 'tech professionals, developers and AI enthusiasts',
    tone: 'technical but accessible, with practical cases and critical analysis',
    categories: ['Generative AI','Tools','Industry','Research','Productivity'],
    topics: [
      { title:'GPT-5 outperforms humans in complex reasoning per new benchmarks', source:'X / Twitter', engagement:'142K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'Anthropic publishes interpretability research on large models', source:'Hacker News', engagement:'3.2K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'Why AI agents keep failing in production: technical analysis', source:'Reddit', engagement:'5.8K upvotes', sent:'Mixed', sentClass:'sent-mix' },
      { title:'EU approves high-risk AI regulations: what changes for your company', source:'Tech News', engagement:'890 shares', sent:'Negative', sentClass:'sent-down' },
      { title:'Cursor vs GitHub Copilot 2026: real comparison after 6 months of use', source:'Reddit', engagement:'7.1K upvotes', sent:'Mixed', sentClass:'sent-mix' },
      { title:'Reasoning models cut automation costs 40% in mid-market companies', source:'LinkedIn', engagement:'15K impressions', sent:'Positive', sentClass:'sent-up' },
      { title:'Apple Intelligence disappoints: why it is late and what it means', source:'X / Twitter', engagement:'89K mentions', sent:'Negative', sentClass:'sent-down' },
    ],
  },
  'ecommerce': {
    label: 'eCommerce & Retail',
    audience: 'online store managers, ecommerce directors and retailers',
    tone: 'practical, conversion-focused, business results oriented',
    categories: ['Conversion','Logistics','AI & Retail','Trends','Platforms'],
    topics: [
      { title:'Amazon launches generative AI for product pages: +23% conversion in beta', source:'Ecommerce News', engagement:'4.5K shares', sent:'Positive', sentClass:'sent-up' },
      { title:'TikTok Shop overtakes Instagram Shopping in direct sales in Europe', source:'X / Twitter', engagement:'67K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'Cart abandonment rises to 78%: new recovery strategies that work', source:'Reddit', engagement:'2.1K upvotes', sent:'Negative', sentClass:'sent-down' },
      { title:'Shopify vs WooCommerce 2026: which platform wins on total cost of ownership', source:'Reddit', engagement:'3.8K upvotes', sent:'Mixed', sentClass:'sent-mix' },
      { title:'Dynamic AI personalization: online store triples average LTV', source:'LinkedIn', engagement:'22K impressions', sent:'Positive', sentClass:'sent-up' },
      { title:'Last-mile logistics costs up 18% in Q1: how to protect margins', source:'Ecommerce News', engagement:'1.2K shares', sent:'Negative', sentClass:'sent-down' },
    ],
  },
  'marketing-digital': {
    label: 'Digital Marketing',
    audience: 'digital marketers, growth hackers and marketing directors',
    tone: 'strategic, data-driven, with real campaign examples',
    categories: ['SEO','Paid Media','Content','Social','Analytics'],
    topics: [
      { title:'Google core algorithm update: content sites down 30% on average', source:'X / Twitter', engagement:'95K mentions', sent:'Negative', sentClass:'sent-down' },
      { title:'Meta Ads CPM up 22% in Q1 2026: strategies to maintain positive ROAS', source:'LinkedIn', engagement:'18K impressions', sent:'Negative', sentClass:'sent-down' },
      { title:'Long-form content ranking again: analysis of 10K articles post-update', source:'Reddit', engagement:'4.2K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'LinkedIn Thought Leadership Ads: CPL 40% lower than Search in B2B', source:'Marketing News', engagement:'780 shares', sent:'Positive', sentClass:'sent-up' },
      { title:'Dark social is now 60% of referral traffic: how to measure it in 2026', source:'Reddit', engagement:'3.1K upvotes', sent:'Mixed', sentClass:'sent-mix' },
      { title:'B2B influencer marketing: cases with documented ROI on LinkedIn', source:'LinkedIn', engagement:'31K impressions', sent:'Positive', sentClass:'sent-up' },
    ],
  },
  'startups': {
    label: 'Startups & Business',
    audience: 'founders, investors, entrepreneurs and startup ecosystem professionals',
    tone: 'direct, inspiring, with practical lessons and no corporate fluff',
    categories: ['Funding','Product','Growth','Culture','Market'],
    topics: [
      { title:'Y Combinator S26: the trends they are funding right now', source:'X / Twitter', engagement:'78K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'73% of 2021 startups will not raise again: post-mortem analysis', source:'TechCrunch', engagement:'5.6K shares', sent:'Negative', sentClass:'sent-down' },
      { title:'0 to $1M ARR in 11 months without investment: bootstrapped SaaS playbook', source:'Reddit', engagement:'9.2K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'VCs shrinking Series A checks: what it means for founders now', source:'LinkedIn', engagement:'42K impressions', sent:'Negative', sentClass:'sent-down' },
      { title:'Product-led growth in B2B: the metrics that matter per 50 founders', source:'Reddit', engagement:'6.8K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'The AI solopreneur: how one person is building 7-figure businesses', source:'X / Twitter', engagement:'112K mentions', sent:'Mixed', sentClass:'sent-mix' },
    ],
  },
  'finanzas': {
    label: 'Finance & Economy',
    audience: 'individual investors, financial analysts and finance professionals',
    tone: 'analytical, rigorous, with macro context and actionable perspective',
    categories: ['Markets','Macro','Investment','Crypto','Fintech'],
    topics: [
      { title:'Fed holds rates: what March inflation data is telling us', source:'Bloomberg', engagement:'23K shares', sent:'Mixed', sentClass:'sent-mix' },
      { title:'Bitcoin breaks $120K: the bull and bear arguments right now', source:'X / Twitter', engagement:'340K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'European banks cut dividends on credit risk: sector analysis', source:'Financial News', engagement:'3.4K shares', sent:'Negative', sentClass:'sent-down' },
      { title:'AI ETFs outperform S&P 500 for second consecutive year', source:'Reddit', engagement:'8.9K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'Digital yuan: China processes 18% of international payments with CBDC', source:'Bloomberg', engagement:'12K shares', sent:'Mixed', sentClass:'sent-mix' },
    ],
  },
  'salud': {
    label: 'Health & Wellness',
    audience: 'health enthusiasts, healthcare professionals and health entrepreneurs',
    tone: 'approachable, evidence-based, practical and non-alarmist',
    categories: ['Research','Nutrition','Mental Health','Health Tech','Lifestyle'],
    topics: [
      { title:'Harvard: 7 hours sleep reduces cardiovascular risk by 34%', source:'Health News', engagement:'156K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'AI detects stage-0 lung cancer with 94% accuracy: first clinical trial', source:'X / Twitter', engagement:'89K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'58% of workers at high burnout risk: European 2026 study', source:'LinkedIn', engagement:'34K impressions', sent:'Negative', sentClass:'sent-down' },
      { title:'Ozempic and the muscle paradox: what doctors are not explaining', source:'Reddit', engagement:'12.4K upvotes', sent:'Mixed', sentClass:'sent-mix' },
      { title:'The 5 foods science confirms transform your gut microbiome', source:'Health News', engagement:'4.2K shares', sent:'Positive', sentClass:'sent-up' },
    ],
  },
  'viajes': {
    label: 'Travel & Tourism',
    audience: 'frequent travelers, digital nomads and tourism professionals',
    tone: 'inspiring, with practical tips and experienced traveler perspective',
    categories: ['Destinations','Trends','Travel Tech','Sustainability','Remote Work'],
    topics: [
      { title:'Top 10 least crowded European destinations exploding in 2026', source:'Travel News', engagement:'67K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'Japan limits Mount Fuji access: the overtourism debate', source:'X / Twitter', engagement:'234K mentions', sent:'Mixed', sentClass:'sent-mix' },
      { title:'Digital nomads in Spain: cities offering real visas and benefits', source:'Reddit', engagement:'18.6K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'Low-cost airlines raising prices 31%: strategies to keep traveling cheap', source:'Reddit', engagement:'9.4K upvotes', sent:'Negative', sentClass:'sent-down' },
      { title:'AI trip planning: honest comparison of Gemini vs ChatGPT vs Claude', source:'Travel News', engagement:'3.1K shares', sent:'Mixed', sentClass:'sent-mix' },
    ],
  },
  'deporte': {
    label: 'Sport & Fitness',
    audience: 'sport enthusiasts, amateur athletes, coaches and fitness professionals',
    tone: 'motivating, science-based, practical and direct',
    categories: ['Training','Sports Nutrition','Technology','Competition','Recovery'],
    topics: [
      { title:'US Olympic athletics team training protocol: leaked details', source:'Reddit', engagement:'34K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'Creatine in women: meta-analysis of 47 studies confirms same benefits', source:'Sports News', engagement:'12K shares', sent:'Positive', sentClass:'sent-up' },
      { title:'Fasted cardio: what the science says vs fitness influencers', source:'X / Twitter', engagement:'56K mentions', sent:'Mixed', sentClass:'sent-mix' },
      { title:'Whoop 5 vs Oura Ring 4: comparison after 3 months parallel testing', source:'Reddit', engagement:'8.9K upvotes', sent:'Mixed', sentClass:'sent-mix' },
      { title:'Why 80% quit the gym before 3 months: the psychology of sport habits', source:'Sports News', engagement:'5.6K shares', sent:'Negative', sentClass:'sent-down' },
    ],
  },
  'sostenibilidad': {
    label: 'Sustainability',
    audience: 'sustainability professionals, green entrepreneurs and conscious consumers',
    tone: 'constructive, data-driven, avoiding greenwashing, honest about trade-offs',
    categories: ['Climate','Circular Economy','Energy','Business','Policy'],
    topics: [
      { title:'Solar surpasses coal in global installed capacity for the first time', source:'Green News', engagement:'234K mentions', sent:'Positive', sentClass:'sent-up' },
      { title:'68% of corporate eco claims are false or misleading: EU report', source:'LinkedIn', engagement:'45K impressions', sent:'Negative', sentClass:'sent-down' },
      { title:'Circular economy in practice: companies genuinely making money from it', source:'Reddit', engagement:'3.4K upvotes', sent:'Positive', sentClass:'sent-up' },
      { title:'Sodium vs lithium batteries: technology changing energy transition costs', source:'Green News', engagement:'7.8K shares', sent:'Positive', sentClass:'sent-up' },
      { title:'COP31 ends without binding agreement: what it means for corporate targets', source:'X / Twitter', engagement:'89K mentions', sent:'Negative', sentClass:'sent-down' },
    ],
  },
};

// === STATE ===
var selectedIds    = new Set();
var generatedPosts = [];
var generatedNL    = null;
var wpConfig       = {};
var currentTopics  = [];

try { var s = sessionStorage.getItem('pd_wp'); if (s) wpConfig = JSON.parse(s); } catch(e) {}
fetch('/auth/me').then(function(r){ return r.json(); }).then(function(d){
  if (d.authenticated) document.getElementById('sidebarUser').textContent = d.user;
});

// === NICHE ===
function getCurrentNiche() {
  var sel = document.getElementById('nicheSelect');
  if (!sel) return NICHES['email-marketing'];
  var val = sel.value;
  if (val === 'custom') {
    var customEl = document.getElementById('nicheCustom');
    var label = (customEl ? customEl.value : '').trim() || 'Custom';
    return { label: label, audience: 'people interested in ' + label, tone: 'informative with practical data', categories: ['Trends','Analysis','Tips','News'], topics: [] };
  }
  return NICHES[val] || NICHES['email-marketing'];
}

function onNicheChange() {
  var sel = document.getElementById('nicheSelect');
  var val = sel ? sel.value : '';
  var c = document.getElementById('nicheCustom');
  if (c) c.style.display = val === 'custom' ? 'block' : 'none';
  resetResults();
}

function resetResults() {
  selectedIds.clear(); currentTopics = [];
  document.getElementById('topicsWrap').style.display = 'none';
  document.getElementById('outputWrap').style.display = 'none';
  document.getElementById('actionBar').classList.remove('visible');
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
    // Catalog topics have no sourceUrl — Verificar button won't appear
    currentTopics = niche.topics.map(function(t, i) {
      return Object.assign({}, t, { id: i + 1, badge: sourceToBadge(t.source) });
    });
    showTopics(niche);
  });
}

// When using AI scan (custom niche), Claude returns actual URLs for each specific
// post or thread — these are real and can be verified directly.
function scanWithAI(niche) {
  var lang = getCurrentLang();
  var prompt = 'Search the web and find 7 real trending posts or threads about "' + niche.label + '" published in the last 48 hours. For each one return the exact URL of that specific post, thread or article (not the homepage). Reply ONLY with JSON no backticks: {"topics":[{"title":"exact headline","source":"platform name","sourceUrl":"https://exact-url-of-this-post.com/...","engagement":"e.g. 1.2K upvotes","sent":"Positive","sentClass":"sent-up"}]}. Mix sent-up/sent-down/sent-mix. Write titles ' + lang.promptLang + '. Only include items with real verifiable URLs.';
  return callAI([{ role: 'user', content: prompt }], null, 1000)
    .then(function(text) {
      var data = JSON.parse(text.replace(/```json|```/g, '').trim());
      currentTopics = (data.topics || []).map(function(t, i) {
        return Object.assign({}, t, { id: i + 1, badge: sourceToBadge(t.source) });
      });
      showTopics(niche);
    })
    .catch(function(e) {
      console.error('AI scan failed:', e);
      // Fallback to catalog topics without URLs
      currentTopics = niche.topics.length > 0
        ? niche.topics.map(function(t, i){ return Object.assign({}, t, { id: i+1, badge: sourceToBadge(t.source) }); })
        : [{ id:1, title:'Trends in ' + niche.label, source:'LinkedIn', badge:'badge-linkedin', engagement:'12K impressions', sent:'Positive', sentClass:'sent-up' }];
      showTopics(niche);
      showToast('Using catalog topics (AI unavailable)', false);
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
// sourceUrl shown as Verify button in portal only.
// NOT included in WP posts or newsletter HTML export.
function renderTopics() {
  var grid = document.getElementById('topicsGrid');
  grid.innerHTML = '';
  currentTopics.forEach(function(t, i) {
    var el = document.createElement('div');
    el.className = 'topic-card' + (selectedIds.has(t.id) ? ' selected' : '');
    el.style.animationDelay = (i * 0.04) + 's';
    var verifyBtn = t.sourceUrl
      ? '<a href="' + t.sourceUrl + '" target="_blank" rel="noopener" class="topic-verify-link">Verify &nearr;</a>'
      : '';
    el.innerHTML =
      '<div class="topic-row1">'
        + '<span class="source-badge ' + t.badge + '">' + t.source + '</span>'
        + '<span class="topic-engagement">' + t.engagement + '</span>'
        + '<div class="topic-check">&#10003;</div>'
      + '</div>'
      + '<div class="topic-title">' + t.title + '</div>'
      + '<div class="topic-footer">'
        + '<span class="' + t.sentClass + '">' + t.sent + '</span>'
        + verifyBtn
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
  var prompt = 'You are a content strategist expert in ' + niche.label + '. Audience: ' + niche.audience + '. Today is ' + todayFormatted() + '.\n\nWith these trending topics, generate blog and newsletter content:\n\n' + topicsList + '\n\nTone: ' + niche.tone + '. Blog categories: ' + cats + '.\nWrite ALL content ' + lang.promptLang + '.\n\nReply ONLY with valid JSON no backticks:\n{"subject_line":"Email subject max 50 chars no emojis","preheader":"Preheader max 90 chars","intro_blurb":"Newsletter opening 1-2 lines agile tone","posts":[{"wp_title":"SEO title max 65 chars","wp_excerpt":"Excerpt 2-3 sentences","wp_content":"4-5 sentences: context + data + impact + actionable recommendation","wp_category":"one of: ' + cats + '","snip_title":"Newsletter headline max 60 chars","snip_body":"2-3 sentences: data point > impact > action","source":"source name"}]}';
  callAI([{ role: 'user', content: prompt }], null, 2000)
    .then(function(text) {
      var data = JSON.parse(text.replace(/```json|```/g, '').trim());
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

// Preview = snippets only (no header/footer)
// Same as export — what you see is exactly what you get when copying HTML.
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
  // Clean preview — snippets only, no header/footer
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
// Snippets block only — no header, no footer, no branding.
// Paste after your header and before your footer in your ESP.
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
    + snips + '\n'
    + '</table>\n'
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