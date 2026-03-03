'use strict';

/**
 * Middleware que protege todas las rutas.
 * Si la petición es AJAX (Accept: application/json) devuelve 401 JSON.
 * Si es navegación normal, redirige al login.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }

  const wantsJSON = req.headers.accept && req.headers.accept.includes('application/json');
  if (wantsJSON) {
    return res.status(401).json({ error: 'No autenticado', redirect: '/login' });
  }

  return res.redirect('/login');
}

module.exports = { requireAuth };
