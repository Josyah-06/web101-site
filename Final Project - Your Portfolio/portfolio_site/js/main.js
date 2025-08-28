// Year stamp
document.getElementById('year').textContent = new Date().getFullYear();

// Helper for current page highlighting (basic)
(function(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.links a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here) a.setAttribute('aria-current', 'page');
  });
})();

// Quote of the Day (tries ZenQuotes, falls back to Quotable or local)
(async function loadQuote(){
  const box = document.getElementById('quote-box');
  const setText = (t) => box && (box.textContent = t);
  try {
    const r = await fetch('https://zenquotes.io/api/random', {cache:'no-store'});
    if (!r.ok) throw new Error('zenquotes http ' + r.status);
    const j = await r.json();
    if (Array.isArray(j) && j[0] && j[0].q) {
      setText(`${j[0].q} — ${j[0].a || 'Unknown'}`);
      return;
    }
    throw new Error('zenquotes bad shape');
  } catch (e) {
    try {
      const r2 = await fetch('https://api.quotable.io/random', {cache:'no-store'});
      if (!r2.ok) throw new Error('quotable http ' + r2.status);
      const j2 = await r2.json();
      setText(`${j2.content} — ${j2.author}`);
      return;
    } catch {
      const fallback = [
        'Code is like humor. When you have to explain it, it’s bad. — Cory House',
        'Programs must be written for people to read. — Harold Abelson',
        'Simplicity is the soul of efficiency. — Austin Freeman'
      ];
      setText(fallback[Math.floor(Math.random()*fallback.length)]);
    }
  }
})();

// Slideshow with setInterval
(function(){
  const el = document.getElementById('slide');
  const cap = document.getElementById('slide-caption');
  if (!el) return;
    const slides = [
  {src:'images/guess.png', caption:'Guess the Number'},
  {src:'images/weather.png', caption:'Weather Website'},
  {src:'images/about.png', caption:'About Me Page'}
];
  // Preload
  slides.forEach(s => { const i = new Image(); i.src = s.src; });
  let i = 0;
  setInterval(() => {
    i = (i + 1) % slides.length;
    el.src = slides[i].src;
    if (cap) cap.textContent = slides[i].caption;
  }, 3000);
})();

// Basic client-side form validation (demo only)
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const val = (id)=> form[id].value.trim();
    const setStatus = (t)=> status && (status.textContent = t);
    if (!val('name')) ok = false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email'))) ok = false;
    if (val('message').length < 10) ok = false;
    setStatus(ok ? 'Thanks! (Demo only—no backend configured.)' : 'Please complete all fields correctly.');
    if (ok) form.reset();
  });
})();
