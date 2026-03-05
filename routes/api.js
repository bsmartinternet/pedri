'use strict';

const express = require('express');
const router  = express.Router();

const MODEL_FAST    = 'claude-haiku-4-5-20251001';   // scan, classification, summaries
const MODEL_CONTENT = 'claude-sonnet-4-20250514';     // newsletter, blog posts

// POST /api/ai/complete
router.post('/ai/complete', async (req, res) => {
  const {
    messages,
    system,
    max_tokens    = 1500,
    use_web_search = false,
    use_fast_model = false,
  } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages required and must be array' });
  }

  try {
    const model = use_fast_model ? MODEL_FAST : MODEL_CONTENT;

    const body = { model, max_tokens, messages };
    if (system) body.system = system;
    if (use_web_search) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    const headers = {
      'Content-Type':      'application/json',
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    };
    if (use_web_search) {
      headers['anthropic-beta'] = 'web-search-2025-03-05';
    }

    console.log(`[AI] model=${model} web_search=${use_web_search} max_tokens=${max_tokens}`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Anthropic Error]', JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic error' });
    }

    const text = (data.content || []).map(b => b.text || '').join('');
    res.json({ text, usage: data.usage });

  } catch (err) {
    console.error('[Anthropic fetch error]', err.message);
    res.status(500).json({ error: 'Error connecting to Anthropic' });
  }
});

// POST /api/wordpress/publish
router.post('/wordpress/publish', async (req, res) => {
  const { posts, wp_url, wp_user, wp_password, status = 'publish' } = req.body;

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return res.status(400).json({ error: 'posts must be a non-empty array' });
  }

  const baseUrl = (wp_url || process.env.WP_URL || '').replace(/\/$/, '');
  const user    = wp_user     || process.env.WP_USER;
  const pass    = wp_password || process.env.WP_APP_PASSWORD;

  if (!baseUrl || !user || !pass) {
    return res.status(400).json({ error: 'Missing WordPress credentials' });
  }

  const token    = Buffer.from(user + ':' + pass).toString('base64');
  const endpoint = baseUrl + '/wp-json/wp/v2/posts';
  const results  = [];

  for (const post of posts) {
    try {
      const wpRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Basic ' + token,
        },
        body: JSON.stringify({
          title:   post.title,
          content: post.content || '',
          excerpt: post.excerpt || '',
          status,
          ...(post.categories ? { categories: post.categories } : {}),
          ...(post.tags       ? { tags: post.tags }             : {}),
        }),
      });
      const json = await wpRes.json();
      if (wpRes.ok) results.push({ ok: true,  id: json.id, link: json.link, title: post.title });
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

  if (!baseUrl || !user || !pass) {
    return res.status(400).json({ ok: false, error: 'Missing connection data' });
  }

  try {
    const token = Buffer.from(user + ':' + pass).toString('base64');
    const wpRes = await fetch(baseUrl + '/wp-json/wp/v2/users/me', {
      headers: { 'Authorization': 'Basic ' + token },
    });
    if (wpRes.ok) {
      const d = await wpRes.json();
      return res.json({ ok: true, wp_user: d.name, wp_url: baseUrl });
    }
    const err = await wpRes.json();
    res.status(401).json({ ok: false, error: err.message || 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Could not connect: ' + err.message });
  }
});

module.exports = router;
