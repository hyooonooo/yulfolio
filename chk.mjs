import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport:{width:900,height:1100} });
for (const f of ['ep96.html','ep98.html','ep49.html','ep106.html']) {
  await p.goto('http://127.0.0.1:8099/'+f, {waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  console.log(f, await p.evaluate(()=>[...document.querySelectorAll('#c-items img')].map(i=>i.getAttribute('src')+':'+i.naturalWidth).join(' | ')));
}
await b.close();
