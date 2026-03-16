/* app.js - PEDRI */
'use strict';

function logout() {
  fetch('/auth/logout', { method: 'POST' }).then(function(){ window.location.href = '/login'; });
}

function showToast(msg, isError, duration) {
  if (isError === undefined) isError = false;
  if (duration === undefined) duration = 3500;
  var t = document.getElementById('_toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '_toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast show' + (isError ? ' error' : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.className = 'toast'; }, duration);
}

// useFastModel=true  -> haiku  (classify, summarise)
// useFastModel=false -> sonnet (newsletter, blog posts)
function callAI(messages, system, max_tokens, _unused, useFastModel) {
  if (max_tokens   === undefined) max_tokens   = 1500;
  if (useFastModel === undefined) useFastModel = false;
  var body = { messages: messages, max_tokens: max_tokens, use_fast_model: useFastModel };
  if (system) body.system = system;
  return fetch('/api/ai/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(function(res) {
    if (res.status === 401) { window.location.href = '/login'; throw new Error('Session expired'); }
    return res.json().then(function(data) {
      if (!res.ok) throw new Error(data.error || 'AI error');
      return data.text;
    });
  });
}

function publishToWP(posts, wpConfig) {
  if (!wpConfig) wpConfig = {};
  var body = Object.assign({ posts: posts }, wpConfig);
  return fetch('/api/wordpress/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(function(res) {
    if (res.status === 401) { window.location.href = '/login'; throw new Error('Session expired'); }
    return res.json();
  });
}

function testWPConnection(wpConfig) {
  return fetch('/api/wordpress/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wpConfig),
  }).then(function(res){ return res.json(); });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(function(){ return true; });
  }
  var ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  document.execCommand('copy'); document.body.removeChild(ta);
  return Promise.resolve(true);
}

function todayFormatted() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}
