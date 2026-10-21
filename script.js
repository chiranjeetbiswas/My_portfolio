const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// theme
const root = document.documentElement;
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';
} catch {}
$('#theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
});

// mobile menu
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('#menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// typing effect
const phrases = ['LLM applications', 'RAG pipelines', 'autonomous AI agents', 'production-grade APIs'];
const out = $('#typed');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  out.textContent = phrases[0];
} else {
  let p = 0, c = 0, del = false;
  (function tick() {
    const word = phrases[p];
    out.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 70);
  })();
}

// reveal + counters
const count = el => {
  const target = +el.dataset.count, plus = 'plus' in el.dataset;
  const year = target > 1900;
  const start = performance.now(), dur = 1200;
  (function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const v = year ? Math.round(2000 + (target - 2000) * t) : Math.round(target * t);
    el.textContent = v + (plus && t === 1 ? '+' : '');
    if (t < 1) requestAnimationFrame(step);
  })(start);
};
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(count);
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => io.observe(el));

// active nav link
const links = $$('#menu a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.hash === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

$('#year').textContent = new Date().getFullYear();
