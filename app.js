
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const plain = s => String(s).replace(/<[^>]+>/g, '');
const ar = k => D[k] ? `style="aspect-ratio:${D[k][0]}/${D[k][1]}"` : '';

document.querySelectorAll('img[data-a]').forEach(i => { i.src = A[i.dataset.a]; });

const scroller = document.getElementById('scroller');
const screen = document.querySelector('.screen');
let stuckAt = 0;

function layoutHero() {
  const bar = screen.querySelector('[data-appbar]');
  const hero = screen.querySelector('[data-hero]');
  if (!bar || !hero) return 0;
  hero.style.marginTop = -bar.offsetHeight + 'px';
  return hero.offsetHeight - bar.offsetHeight;
}
function syncAppbar() {
  const bar = screen.querySelector('[data-appbar]');
  if (!bar) return;
  const on = scroller.scrollTop > stuckAt;
  if (bar.classList.contains('is-stuck') === on) return;
  bar.classList.toggle('is-stuck', on);
  bar.querySelectorAll('img[data-dark]').forEach(i => { i.src = A[on ? i.dataset.dark : i.dataset.a]; });
}
function relayout() { stuckAt = layoutHero(); syncAppbar(); }

scroller.addEventListener('scroll', syncAppbar, {passive: true});
addEventListener('resize', relayout);
addEventListener('load', relayout);
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-href]');
  if (el) location.href = el.dataset.href;
});
