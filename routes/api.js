'use strict';

const express = require('express');
const router = express.Router();

// ─────────────────────────────────────────────
// POST /api/ai/complete
// Proxy seguro hacia Anthropic — la API key nunca sale al cliente
// ─────────────────────────────────────────────
router.post('/ai/complete', async (req, res) => {
  const { messages, system, max_tokens = 1500 } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages es requerido y debe ser un array' });
  }

  try {
    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens,
      messages,
    };
    if (system) body.system = system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Anthropic Error]', data);
      return res.status(response.status).json({ error: data.error?.message || 'Error de Anthropic' });
    }

    // Extrae el texto del primer bloque de contenido
    const text = data.content?.map(b => b.text || '').join('') || '';
    res.json({ text, usage: data.usage });

  } catch (err) {
    console.error('[Anthropic fetch error]', err.message);
    res.status(500).json({ error: 'Error conectando con Anthropic' });
  }
});

// ─────────────────────────────────────────────
// POST /api/wordpress/publish
// Publica uno o varios posts en WordPress via REST API
// Acepta credenciales del body O usa las variables de entorno como fallback
// ─────────────────────────────────────────────
router.post('/wordpress/publish', async (req, res) => {
  const {
    posts,
    wp_url,
    wp_user,
    wp_password,
    status = 'publish',
  } = req.body;

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return res.status(400).json({ error: 'posts debe ser un array con al menos un elemento' });
  }

  // Usa las credenciales del body, o fallback a variables de entorno
  const baseUrl = (wp_url || process.env.WP_URL || '').replace(/\/$/, '');
  const user    = wp_user     || process.env.WP_USER;
  const pass    = wp_password || process.env.WP_APP_PASSWORD;

  if (!baseUrl || !user || !pass) {
    return res.status(400).json({
      error: 'Faltan credenciales de WordPress. Configúralas en la UI o en el .env',
    });
  }

  const token = Buffer.from(`${user}:${pass}`).toString('base64');
  const endpoint = `${baseUrl}/wp-json/wp/v2/posts`;

  const results = [];

  for (const post of posts) {
    try {
      const wpRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`,
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

      if (wpRes.ok) {
        results.push({ ok: true, id: json.id, link: json.link, title: post.title });
      } else {
        results.push({ ok: false, title: post.title, error: json.message || wpRes.status });
      }
    } catch (err) {
      results.push({ ok: false, title: post.title, error: err.message });
    }
  }

  const allOk = results.every(r => r.ok);
  res.status(allOk ? 200 : 207).json({ results });
});

// ─────────────────────────────────────────────
// GET /api/wordpress/test
// Comprueba la conexión con WordPress
// ─────────────────────────────────────────────
router.post('/wordpress/test', async (req, res) => {
  const { wp_url, wp_user, wp_password } = req.body;

  const baseUrl = (wp_url || process.env.WP_URL || '').replace(/\/$/, '');
  const user    = wp_user     || process.env.WP_USER;
  const pass    = wp_password || process.env.WP_APP_PASSWORD;

  if (!baseUrl || !user || !pass) {
    return res.status(400).json({ ok: false, error: 'Faltan datos de conexión' });
  }

  try {
    const token = Buffer.from(`${user}:${pass}`).toString('base64');
    const wpRes = await fetch(`${baseUrl}/wp-json/wp/v2/users/me`, {
      headers: { 'Authorization': `Basic ${token}` },
    });

    if (wpRes.ok) {
      const data = await wpRes.json();
      return res.json({ ok: true, wp_user: data.name, wp_url: baseUrl });
    }

    const err = await wpRes.json();
    res.status(401).json({ ok: false, error: err.message || 'Credenciales incorrectas' });

  } catch (err) {
    res.status(500).json({ ok: false, error: `No se pudo conectar: ${err.message}` });
  }
});

// ─────────────────────────────────────────────
// Aquí irán más rutas de herramientas en el futuro
// Ejemplo: router.use('/offers', require('./offers'));
// ─────────────────────────────────────────────

module.exports = router;
