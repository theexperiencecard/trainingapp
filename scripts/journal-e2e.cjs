// Browser check of the on-device journal against the production build (docs/30, criteria 1-3).
// Not a project dependency: it uses an already installed Playwright with Chromium.
// Run: npm run build && npm run preview, then in another terminal
//   NODE_PATH=<folder containing playwright> node scripts/journal-e2e.cjs
// Use a fresh browser profile: the script expects an empty journal.
const { chromium } = require('playwright');
const assert = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('ok -', m); };
const URL = process.env.JOURNAL_URL ?? 'http://localhost:4173/';
const SHOTS = process.env.JOURNAL_SHOTS ?? '.';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
  let page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(URL);
  const J = () => page.locator('section[aria-labelledby="journal-heading"]');
  await J().getByRole('button', { name: 'Salva la serie' }).waitFor();
  // wait for offline shell
  await page.getByText('pronta', { exact: false }).first().waitFor({ timeout: 15000 }).catch(() => {});
  const swReady = await page.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
  assert(swReady, 'service worker active');
  await page.reload(); // let SW control the page
  await J().getByRole('button', { name: 'Salva la serie' }).waitFor();

  // 1. offline record with unknown RIR, then close and reopen offline
  await ctx.setOffline(true);
  await J().getByLabel('Carico in kg').fill('42,5');
  await J().getByLabel('Ripetizioni', { exact: true }).fill('10');
  await J().getByLabel(/RIR/).fill('');
  await J().getByRole('button', { name: 'Salva la serie' }).click();
  await J().getByText('Serie salvata sul dispositivo.').waitFor();
  const before = await page.evaluate(() => new Promise(r => { const o = indexedDB.open('trainingapp-journal'); o.onsuccess = () => { const t = o.result.transaction('sets').objectStore('sets').getAll(); t.onsuccess = () => { r(t.result); o.result.close(); }; }; }));
  assert(before.length === 1 && before[0].fields.rir === null && before[0].fields.load.value === 42.5 && before[0].fields.load.unit === 'kg', 'saved set with RIR null and 42.5 kg');
  await page.close();
  page = await ctx.newPage();
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(URL); // still offline
  await J().getByText('42,5 kg totali × 10 · RIR non indicata').waitFor();
  const after = await page.evaluate(() => new Promise(r => { const o = indexedDB.open('trainingapp-journal'); o.onsuccess = () => { const tx = o.result.transaction(['sets','sessions']); const a = tx.objectStore('sets').getAll(); const b = tx.objectStore('sessions').getAll(); tx.oncomplete = () => { r({ sets: a.result, sessions: b.result }); o.result.close(); }; }; }));
  assert(after.sets[0].id === before[0].id, 'same set ID after reopening offline');
  const d = new Date(); const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  assert(after.sessions[0].actualDate === today, 'local day stored ' + today);

  // write failure: no confirmation, retry creates a single set
  await page.evaluate(() => {
    const orig = IDBObjectStore.prototype.add; let fail = true;
    IDBObjectStore.prototype.add = function (...a) { if (fail && this.name === 'operations') { fail = false; throw new DOMException('simulated', 'QuotaExceededError'); } return orig.apply(this, a); };
  });
  await J().getByLabel('Carico in kg').fill('40');
  await J().getByLabel('Ripetizioni', { exact: true }).fill('12');
  await J().getByRole('button', { name: 'Salva la serie' }).click();
  await J().getByText('La serie non è stata salvata. Riprova: non verrà duplicata.').waitFor();
  assert(await J().getByText('Serie salvata sul dispositivo.').count() === 0, 'no confirmation after failed write');
  let count = await J().locator('.demo-history li').count();
  assert(count === 1, 'failed write left no partial set');
  await J().getByRole('button', { name: 'Riprova' }).click();
  await J().getByText('Serie salvata sul dispositivo.').waitFor();
  await J().getByRole('button', { name: 'Salva la serie' }).waitFor();
  count = await J().locator('.demo-history > ol > li').count();
  assert(count === 2, 'retry created exactly one set');
  // 2. bench + chest press sets keep identity
  await J().getByLabel('Esercizio').selectOption('machine');
  await J().getByLabel('Carico in kg').fill('25');
  await J().getByLabel('Ripetizioni', { exact: true }).fill('10');
  await J().getByLabel(/RIR/).fill('2');
  await J().getByRole('button', { name: 'Salva la serie' }).click();
  await J().getByText('25 kg indicati × 10 · RIR 2').waitFor();
  const vol = await J().locator('dl').innerText();
  assert(vol.includes('Panca piana') && vol.includes('905 kg totali') && vol.includes('Chest press M1') && vol.includes('250 kg indicati'), 'separate volumes: ' + vol.replace(/\n/g, ' | '));

  // 3. two tabs: independent fields merge; same field conflict visible
  await ctx.setOffline(false);
  const p2 = await ctx.newPage();
  p2.on('pageerror', e => errors.push(String(e)));
  await p2.goto(URL);
  const J2 = () => p2.locator('section[aria-labelledby="journal-heading"]');
  await J2().getByText('25 kg indicati × 10 · RIR 2').waitFor();
  const row1 = J().locator('.demo-history > ol > li').nth(2);
  const row2 = J2().locator('.demo-history > ol > li').nth(2);
  await row1.getByRole('button', { name: 'Correggi' }).click();
  await row2.getByRole('button', { name: 'Correggi' }).click();
  await row1.getByLabel('Ripetizioni', { exact: true }).fill('9');
  await row1.getByRole('button', { name: 'Salva la correzione' }).click();
  await J().getByText('25 kg indicati × 9 · RIR 2').waitFor();
  await row2.getByLabel('Carico in kg').fill('27,5');
  await row2.getByRole('button', { name: 'Salva la correzione' }).click();
  await J2().getByText('27,5 kg indicati × 9 · RIR 2').waitFor();
  assert(await J2().locator('.journal-conflict').count() === 0, 'independent fields from two tabs merged (27,5 × 9) without conflict');
  await J().getByText('27,5 kg indicati × 9 · RIR 2').waitFor({ timeout: 3000 });
  assert(true, 'first tab refreshed via broadcast');
  // conflict: both edit load from same base
  await row1.getByRole('button', { name: 'Correggi' }).click();
  await row2.getByRole('button', { name: 'Correggi' }).click();
  await row1.getByLabel('Carico in kg').fill('30');
  await row1.getByRole('button', { name: 'Salva la correzione' }).click();
  await J().getByText('30 kg indicati × 9').waitFor();
  await row2.getByLabel('Carico in kg').fill('32,5');
  await row2.getByRole('button', { name: 'Salva la correzione' }).click();
  await J2().getByText("Un'altra scheda ha cambiato questa serie").waitFor();
  const conflictText = await J2().locator('.journal-conflict').innerText();
  assert(conflictText.includes('salvato 30 kg indicati') && conflictText.includes('tuo 32,5 kg indicati'), 'conflict shows both values');
  await J2().getByText('30 kg indicati × 9 · RIR 2').waitFor();
  assert(true, 'stored value kept during conflict');
  await J2().getByRole('button', { name: 'Usa il mio valore' }).click();
  await J2().getByText('32,5 kg indicati × 9 · RIR 2').waitFor();
  assert(true, 'explicit resolution applies the chosen value');
  // delete vs concurrent edit
  const r1 = J().locator('.demo-history > ol > li').nth(0);
  const r2 = J2().locator('.demo-history > ol > li').nth(0);
  await J().getByText('32,5 kg indicati').waitFor();
  await r2.getByRole('button', { name: 'Correggi' }).click(); // tab2 holds old base
  await r1.getByRole('button', { name: 'Elimina' }).click();
  await J().getByText('Eliminata: Panca piana').waitFor();
  await r2.getByLabel('Ripetizioni', { exact: true }).fill('11');
  await r2.getByRole('button', { name: 'Salva la correzione' }).click();
  const c2 = await J2().locator('.journal-conflict').innerText();
  assert(c2.includes('Eliminata: salvato eliminata, tuo presente') && c2.includes('Ripetizioni: salvato 10, tuo 11'), 'edit on a set deleted elsewhere is a visible conflict: ' + c2.replace(/\n/g,' | '));
  await J2().getByRole('button', { name: 'Usa il mio valore' }).click();
  await J().getByText('Panca piana · 42,5 kg totali × 11').waitFor();
  assert(await J().getByText('Eliminata: Panca piana · 42,5').count() === 0, 'choosing my value restores the set with the correction, seen in the other tab');
  await r1.getByRole('button', { name: 'Elimina' }).click();
  await J().getByText('Eliminata: Panca piana · 42,5').waitFor();
  await r1.getByRole('button', { name: 'Ripristina' }).click();
  await J().locator('.demo-history > ol > li').nth(0).getByRole('button', { name: 'Correggi' }).waitFor();
  assert(true, 'delete and restore work');
  // language switch
  await page.getByLabel('Lingua').selectOption('de').catch(async () => { await page.locator('.language-picker select').selectOption('de'); });
  await J().getByRole('heading', { name: 'Trainingstagebuch auf dem Gerät' }).waitFor();
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  assert(w <= 360, 'no horizontal scroll at 360px in German: ' + w);
  await page.screenshot({ path: `${SHOTS}/journal-de.png`, fullPage: true });
  await page.locator('.language-picker select').selectOption('it');
  await page.screenshot({ path: `${SHOTS}/journal-it.png`, fullPage: true });
  assert(errors.length === 0, 'no page errors ' + errors.join(';'));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
