'use strict';

const express = require('express');
const router  = express.Router();

const MODEL_FAST    = 'claude-haiku-4-5-20251001';
const MODEL_CONTENT = 'claude-sonnet-4-20250514';

// In-memory cache: "niche|lang" -> { topics, expiresAt }
const searchCache = new Map();
const CACHE_TTL   = 6 * 60 * 60 * 1000; // 6 hours

function getCached(key) {
  const e = searchCache.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) { searchCache.delete(key); return null; }
  return e.topics;
}

function setCache(key, topics) {
  searchCache.set(key, { topics, expiresAt: Date.now() + CACHE_TTL });
}

// POST /api/search/topics
// Brave News -> Haiku classify -> cache 6h
router.post('/search/topics', async (req, res) => {
  const { niche, lang, promptLang } = req.body;
  if (!niche || !lang) return res.status(400).json({ error: 'niche and lang required' });

  const cacheKey = niche + '|' + lang;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log('[Search] Cache hit:', cacheKey);
    return res.json({ topics: cached, fromCache: true });
  }

  const braveKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!braveKey) return res.status(500).json({ error: 'BRAVE_SEARCH_API_KEY not configured' });

  try {
    // Step 1: Brave News Search
    const query    = encodeURIComponent(niche + ' news today');
    const braveRes = await fetch(
      'https://api.search.brave.com/res/v1/news/search?q=' + query + '&count=10&freshness=pd&sort=popularity',
      { headers: { 'Accept': 'application/json', 'Accept-Encoding': 'gzip', 'X-Subscription-Token': braveKey } }
    );

    if (!braveRes.ok) {
      const txt = await braveRes.text();
      console.error('[Brave Error]', braveRes.status, txt);
      return res.status(502).json({ error: 'Brave Search error ' + braveRes.status });
    }

    const braveData = await braveRes.json();
    const articles  = (braveData.results || []).slice(0, 10);
    if (articles.length === 0) return res.status(404).json({ error: 'No results from Brave Search' });

    // Step 2: Haiku classifies sentiment + formats JSON
    // Build article list — sanitize titles to avoid breaking JSON
    const articleList = articles.map((a, i) => {
      const title  = (a.title || '').replace(/"/g, "'").replace(/[\r\n]/g, ' ').slice(0, 120);
      const source = (a.source || (a.meta_url && a.meta_url.hostname) || 'unknown').slice(0, 40);
      const url    = (a.url || '').slice(0, 200);
      return (i + 1) + '. TITLE: ' + title + ' | SOURCE: ' + source + ' | URL: ' + url;
    }).join('\n');

    // Strict prompt — numbered list format avoids quote escaping issues
    const prompt = 'You are a JSON API. Classify these news articles about "' + niche + '".\n\nArticles:\n' + articleList + '\n\nReturn a JSON array. For each article use the exact title and URL from the input. Sentiment: Positive/Negative/Mixed.\n\nRules:\n- Escape all quotes inside strings\n- No trailing commas\n- sentClass: sent-up=Positive, sent-down=Negative, sent-mix=Mixed\n- engagement: short string like "High impact" or "Trending"\n\nReturn ONLY this JSON, no explanation, no backticks:\n{"topics":[{"title":"...","source":"...","sourceUrl":"...","engagement":"...","sent":"Positive","sentClass":"sent-up"}]}';

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL_FAST, max_tokens: 800, messages: [{ role: 'user', content: prompt }] }),
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) {
      console.error('[Haiku Error]', JSON.stringify(aiData));
      return res.status(aiRes.status).json({ error: aiData.error?.message || 'AI error' });
    }

    const text  = (aiData.content || []).map(b => b.text || '').join('');
    let data;
    // Try to parse Haiku JSON — fall back to raw Brave data if anything fails
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      data = JSON.parse(match ? match[0] : clean);
    } catch (parseErr) {
      console.warn('[Haiku parse failed, using Brave directly]', parseErr.message);
      data = {
        topics: articles.map(a => ({
          title:      (a.title || '').replace(/"/g, "'").slice(0, 120),
          source:     a.source || (a.meta_url && a.meta_url.hostname) || 'News',
          sourceUrl:  a.url || '',
          engagement: 'Trending',
          sent:       'Mixed',
          sentClass:  'sent-mix',
        }))
      };
    }

    console.log('[Search] OK:', cacheKey, '— topics:', (data.topics || []).length, '— tokens:', JSON.stringify(aiData.usage));
    setCache(cacheKey, data.topics);
    res.json({ topics: data.topics, fromCache: false });

  } catch (err) {
    console.error('[Search error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/search/cache
router.delete('/search/cache', (req, res) => {
  const n = searchCache.size;
  searchCache.clear();
  res.json({ cleared: n });
});

// POST /api/ai/complete
router.post('/ai/complete', async (req, res) => {
  const { messages, system, max_tokens = 1500, use_fast_model = false } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages required' });

  try {
    const model = use_fast_model ? MODEL_FAST : MODEL_CONTENT;
    const body  = { model, max_tokens, messages };
    if (system) body.system = system;

    console.log('[AI] model=' + model + ' max_tokens=' + max_tokens);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Anthropic Error]', JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic error' });
    }

    res.json({ text: (data.content || []).map(b => b.text || '').join(''), usage: data.usage });
  } catch (err) {
    console.error('[Anthropic error]', err.message);
    res.status(500).json({ error: 'Error connecting to Anthropic' });
  }
});

// POST /api/wordpress/publish
router.post('/wordpress/publish', async (req, res) => {
  const { posts, wp_url, wp_user, wp_password, status = 'publish' } = req.body;
  if (!posts || !Array.isArray(posts) || posts.length === 0) return res.status(400).json({ error: 'posts required' });

  const baseUrl = (wp_url || process.env.WP_URL || '').replace(/\/$/, '');
  const user    = wp_user     || process.env.WP_USER;
  const pass    = wp_password || process.env.WP_APP_PASSWORD;
  if (!baseUrl || !user || !pass) return res.status(400).json({ error: 'Missing WordPress credentials' });

  const token = Buffer.from(user + ':' + pass).toString('base64');
  const results = [];

  for (const post of posts) {
    try {
      const wpRes = await fetch(baseUrl + '/wp-json/wp/v2/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + token },
        body: JSON.stringify({ title: post.title, content: post.content || '', excerpt: post.excerpt || '', status }),
      });
      const json = await wpRes.json();
      if (wpRes.ok) results.push({ ok: true, id: json.id, link: json.link, title: post.title });
      else          results.push({ ok: false, title: post.title, error: json.message || wpRes.status });
    } catch (err) {
      results.push({ ok: false, title: post.title, error: err.message });
    }
  }

  res.status(results.every(r => r.ok) ? 200 : 207).json({ results });
});

// POST /api/wordpress/test
router.post('/wordpress/test', async (req, res) => {
  const { wp_url, wp_user, wp_password } = req.body;
  const baseUrl = (wp_url || process.env.WP_URL || '').replace(/\/$/, '');
  const user    = wp_user     || process.env.WP_USER;
  const pass    = wp_password || process.env.WP_APP_PASSWORD;
  if (!baseUrl || !user || !pass) return res.status(400).json({ ok: false, error: 'Missing data' });

  try {
    const token = Buffer.from(user + ':' + pass).toString('base64');
    const r = await fetch(baseUrl + '/wp-json/wp/v2/users/me', { headers: { 'Authorization': 'Basic ' + token } });
    if (r.ok) { const d = await r.json(); return res.json({ ok: true, wp_user: d.name, wp_url: baseUrl }); }
    const e = await r.json();
    res.status(401).json({ ok: false, error: e.message || 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Could not connect: ' + err.message });
  }
});

module.exports = router;
