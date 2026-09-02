
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

const BUILT = new Set([4, 13, 19, 30, 35, 37, 41, 49, 59, 61, 64, 65, 68, 70, 80, 82, 83, 91, 92, 96, 98, 106]);
function offify() {
  document.querySelectorAll('.d-eprow').forEach(b => {
    const no = Number((b.querySelector('.d-eprow__no') || {}).textContent);
    if (BUILT.has(no)) return;
    b.classList.add('is-off');
    b.disabled = true;
    b.setAttribute('aria-disabled', 'true');
    if (!/준비 중/.test(b.getAttribute('aria-label') || '')) {
      b.setAttribute('aria-label', (b.getAttribute('aria-label') || '') + ' (준비 중)');
    }
  });
}
addEventListener('load', offify);
