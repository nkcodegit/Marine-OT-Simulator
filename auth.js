(function () {
  const $ = id => document.getElementById(id), cfg = window.APP_CONFIG, KEY = 'marine_ot_guest';
  const msg = t => { $('lmsg').textContent = t; };
  let fb = null;
  const ok = (k, d) => { try { return localStorage[k] ? localStorage[k] : d; } catch (e) { return d; } };
  function allowed(u) {
    const e = (u.email || '').toLowerCase();
    if (!cfg.ALLOWED_EMAILS.length && !cfg.ALLOWED_DOMAINS.length) return true;
    return cfg.ALLOWED_EMAILS.map(x => x.toLowerCase()).includes(e) ||
           cfg.ALLOWED_DOMAINS.map(x => x.toLowerCase()).includes(e.split('@')[1]);
  }
  function enter(u) {
    $('login').hidden = true; $('app').hidden = false;
    $('who').textContent = u.name || u.email || 'User';
    if (u.picture) { $('pic').src = u.picture; $('pic').hidden = false; } else $('pic').hidden = true;
  }
  function guest() {
    const n = $('nick').value.trim().slice(0, 30);
    if (n.length < 2) return msg('Enter a nickname (at least 2 characters).');
    try { localStorage[KEY] = n; } catch (e) {}
    enter({ name: n + ' (guest)' });
  }
  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  async function initFirebase() {
    try {
      const b = 'https://www.gstatic.com/firebasejs/10.12.2/';
      await load(b + 'firebase-app-compat.js'); await load(b + 'firebase-auth-compat.js');
      firebase.initializeApp(cfg.FIREBASE); fb = firebase.auth();
      fb.onAuthStateChanged(u => {
        if (!u) return;
        const x = { name: u.displayName || u.email, email: u.email, picture: u.photoURL };
        if (!allowed(x)) { msg('This account is not authorised for this app.'); fb.signOut(); return; }
        enter(x);
      });
      $('fbbox').hidden = false;
    } catch (e) { msg('Could not load account sign-in. Guest login still works.'); }
  }
  const social = n => fb.signInWithPopup(n === 'g' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.GithubAuthProvider()).catch(e => msg(e.message));
  $('guest').onclick = guest;
  $('nick').onkeydown = e => { if (e.key === 'Enter') guest(); };
  $('bg').onclick = () => social('g'); $('bh').onclick = () => social('h');
  $('bi').onclick = () => fb.signInWithEmailAndPassword($('em').value, $('pw').value).catch(e => msg(e.message));
  $('bc').onclick = () => fb.createUserWithEmailAndPassword($('em').value, $('pw').value).catch(e => msg(e.message));
  $('so').onclick = () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    Promise.resolve(fb && fb.signOut()).then(() => location.reload());
  };
  if (!cfg.ALLOW_GUEST) $('gbox').hidden = true;
  if (cfg.FIREBASE) initFirebase();
  const saved = ok(KEY, ''); if (saved && cfg.ALLOW_GUEST) enter({ name: saved + ' (guest)' });
})();
