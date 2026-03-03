/* app.js — utilidades globales de Pedri */
'use strict';

// ─── Logout ───
async function logout() {
  await fetch('/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}

// ─── Toast ───
function showToast(msg, isError = false, duration = 3500) {
  let t = document.getElementById('_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '_toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast show' + (isError ? ' error' : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast'; }, duration);
}

// ─── API helper (proxy interno) ───
async function callAI(messages, system = null, max_tokens = 1500) {
  const body = { messages, max_tokens };
  if (system) body.system = system;

  const res = await fetch('/api/ai/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de AI');
  return data.text;
}

// ─── WordPress helper ───
async function publishToWP(posts, wpConfig = {}) {
  const res = await fetch('/api/wordpress/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts, ...wpConfig }),
  });

  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  return res.json();
}

async function testWPConnection(wpConfig) {
  const res = await fetch('/api/wordpress/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wpConfig),
  });
  return res.json();
}

// ─── Copy to clipboard ───
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
}

// ─── Formato de fecha ───
function todayFormatted() {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}
