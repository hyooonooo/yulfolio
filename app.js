
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

/* ---------- 토스트 ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 1900);
}

/* ---------- 좋아요 · 스크랩 ---------- */
function pop(btn) {
  btn.classList.remove('is-pop');
  void btn.offsetWidth;
  btn.classList.add('is-pop');
}
function bindToggle(label, offKey, onKey, onLabel, msgOn, msgOff) {
  document.querySelectorAll('.d-tool[aria-label="' + label + '"]').forEach(btn => {
    const img = btn.querySelector('img');
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? onLabel : label);
      if (img) img.src = A[on ? onKey : offKey];
      pop(btn);
      const msg = on ? msgOn : msgOff;
      if (msg) toast(msg);
    });
  });
}
bindToggle('좋아요', 's2_heart_d', 're0', '좋아요 취소', '', '');   // 실제 앱은 토스트 없이 아이콘만 바뀐다
bindToggle('저장하기', 's2_bookmark_d', 's2_bookmark_on', '저장 취소',
           '스크랩 목록에 저장했어요.', '스크랩 목록에서 삭제했어요.');

/* ---------- 공유 시트 ---------- */
const sheet = document.getElementById('sheet');
const scrim = document.getElementById('sheet-scrim');
let sheetOpener = null;
function openSheet(btn) {
  if (!sheet) return;
  sheetOpener = btn || null;
  sheet.hidden = false; scrim.hidden = false;
  requestAnimationFrame(() => { sheet.classList.add('is-on'); scrim.classList.add('is-on'); });
  const close = document.getElementById('sheet-close');
  if (close) close.focus();
}
function closeSheet() {
  if (!sheet || sheet.hidden) return;
  sheet.classList.remove('is-on'); scrim.classList.remove('is-on');
  setTimeout(() => { sheet.hidden = true; scrim.hidden = true; }, 300);
  if (sheetOpener) { sheetOpener.focus(); sheetOpener = null; }
}
document.querySelectorAll('[aria-label="공유하기"]').forEach(btn => {
  btn.addEventListener('click', () => openSheet(btn));
});
if (scrim) scrim.addEventListener('click', closeSheet);
const sheetClose = document.getElementById('sheet-close');
if (sheetClose) sheetClose.addEventListener('click', closeSheet);
addEventListener('keydown', ev => { if (ev.key === 'Escape') closeSheet(); });

document.querySelectorAll('.sheet__item').forEach(btn => {
  btn.addEventListener('click', () => {
    const to = btn.dataset.share;
    closeSheet();
    if (to === '링크') {
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).catch(() => {});
      setTimeout(() => toast('URL을 복사했습니다.'), 160);
    } else {
      setTimeout(() => toast(to + '(으)로 공유했어요.'), 160);
    }
  });
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
