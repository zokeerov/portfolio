// Навигация: тень при скролле
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Мобильное меню
const burger = document.getElementById('burger');
const menu = document.getElementById('mobileMenu');
const toggleMenu = (open) => {
  burger.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => toggleMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// Появление блоков при скролле
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Подсветка активного раздела в меню и боковом индексе
const links = document.querySelectorAll('.nav__link, .side-index a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => secObs.observe(s));

// Фильтр портфолио
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.toggle('is-active', b === btn));
  const f = btn.dataset.filter;
  cards.forEach(c => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
}));

// Таймкод и таймлайн в рамке на хедере
const tc = document.getElementById('timecode');
const bar = document.querySelector('.frame__timeline i');
const FPS = 25, LOOP = 12; // секунд
const pad = (n) => String(n).padStart(2, '0');
const start = performance.now();
function tick(now) {
  const t = ((now - start) / 1000) % LOOP;
  const s = Math.floor(t), f = Math.floor((t - s) * FPS);
  tc.textContent = `00:00:${pad(s)}:${pad(f)}`;
  bar.style.width = (t / LOOP * 100) + '%';
  requestAnimationFrame(tick);
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);
