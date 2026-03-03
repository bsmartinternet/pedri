'use strict';

const express = require('express');
const router = express.Router();

// POST /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const validUser = username === process.env.APP_USER;
  const validPass = password === process.env.APP_PASSWORD;

  if (!validUser || !validPass) {
    // Delay mínimo para dificultar fuerza bruta
    return setTimeout(() => {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }, 600);
  }

  req.session.authenticated = true;
  req.session.user = process.env.APP_USER;
  req.session.loginAt = Date.now();

  res.json({ ok: true, redirect: '/' });
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session = null; // cookie-session: asignar null destruye la sesión
  res.json({ ok: true, redirect: '/login' });
});

// GET /auth/me — comprueba si la sesión está activa (útil para el frontend)
router.get('/me', (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  res.status(401).json({ authenticated: false });
});

module.exports = router;
