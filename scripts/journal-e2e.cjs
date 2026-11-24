// Production-browser regression. Run npm run build first. Uses the environment's Playwright.
const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { chromium, expect } = require('playwright/test');
const it = require('../src/locales/journal-it.json');
const chart = require('../src/locales/chart-it.json');
const shell = require('../src/locales/it.json');
const demo = require('../src/locales/demo-it.json');
const timer = require('../src/locales/timer-it.json');
const profileLabels = require('../src/locales/profile-it.json');

const journal = page => page.getByRole('region', { name: it.heading, exact: true });
const button = (scope, text) => scope.getByRole('button', { name: text, exact: true });
const field = (scope, text) => scope.getByLabel(text, { exact: true });
const choice = (scope, text) => scope.getByRole('combobox', { name: text });
const history = page => journal(page).locator('ol > li');

async function edit(page, index, name, value) {
  await button(history(page).nth(index), it.edit).click();
  const form = journal(page).getByRole('group', { name: it.correct });
  await choice(form, it.field).selectOption(name);
  if (name === 'status') await choice(form, it.status).selectOption(value);
  else await field(form, it[name]).fill(value);
}

async function saveEdit(page) {
  await button(journal(page), it.save).click();
  await expect(journal(page).getByText(it.saved, { exact: true })).toBeVisible();
}

async function snapshot(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('trainingapp-synthetic-journal');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(['sets', 'sessions', 'operations']);
      const sets = tx.objectStore('sets').getAll();
      const sessions = tx.objectStore('sessions').getAll();
      const operationCount = tx.objectStore('operations').count();
      tx.oncomplete = () => {
        db.close();
        resolve({ sets: sets.result, sessions: sessions.result, operationCount: operationCount.result });
      };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }));
}

async function verify() {
  const { preview } = await import('vite');
  const profile = await mkdtemp(join(tmpdir(), 'training-journal-'));
  const server = await preview({ logLevel: 'silent', preview: { host: '127.0.0.1', port: 0 } });
  const url = 'http://127.0.0.1:' + server.httpServer.address().port;
  const errors = [];
  async function launch() {
    const ctx = await chromium.launchPersistentContext(profile, {
      executablePath: process.env.CHROMIUM_PATH,
      viewport: { width: 360, height: 800 },
      timezoneId: 'Pacific/Kiritimati',
    });
    ctx.setDefaultTimeout(7000);
    ctx.on('weberror', error => errors.push(String(error.error())));
    return ctx;
  }

  let ctx;
  try {
    ctx = await launch();
    let page = ctx.pages()[0];
    await page.goto(url);
    await expect(page.getByText(shell.offlineReady, { exact: true })).toBeVisible();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await ctx.setOffline(true);
    await field(journal(page), it.kg).fill('42,5');
    await field(journal(page), it.reps).fill('10');
    await field(journal(page), it.rir).fill('');
    await button(journal(page), it.add).click();
    await expect(history(page)).toHaveCount(1);
    const first = await snapshot(page);
    assert.equal(first.sets[0].rir, null);
    assert.equal(first.sets[0].kg, 42.5);
    assert.equal(first.sets[0].unit, 'kg');
    const day = await page.evaluate(created => new Intl.DateTimeFormat('sv-SE').format(new Date(created)), first.sets[0].createdAt);
    assert.equal(first.sessions[0].actualDay, day);
    assert.equal(first.operationCount, 1);

    await ctx.close();
    ctx = await launch();
    await ctx.setOffline(true);
    page = ctx.pages()[0];
    await page.goto(url);
    await expect(history(page)).toHaveCount(1);
    assert.deepEqual(await snapshot(page), first);
    console.log('OK offline write and complete browser restart with the same record and local date');

    // Inject a quota failure after the set write, on the last store in the same transaction.
    await page.evaluate(() => {
      const original = IDBObjectStore.prototype.add;
      IDBObjectStore.prototype.add = function (...args) {
        if (this.name !== 'operations') return original.apply(this, args);
        IDBObjectStore.prototype.add = original;
        throw new DOMException('Test write failure', 'QuotaExceededError');
      };
    });
    await choice(journal(page), it.exercise).selectOption('machine');
    await field(journal(page), it.kg).fill('25');
    await field(journal(page), it.reps).fill('10');
    await button(journal(page), it.add).click();
    await expect(journal(page).getByText(it.writeError, { exact: true })).toBeVisible();
    await expect(journal(page).getByText(it.saved, { exact: true })).toHaveCount(0);
    assert.deepEqual(await snapshot(page), first);
    await button(journal(page), it.add).click();
    await expect(history(page)).toHaveCount(2);
    assert.equal((await snapshot(page)).operationCount, 2);
    await choice(page, chart.exercise).selectOption('bench');
    await expect(page.locator('.journal-chart')).toContainText('425 kg');
    await choice(page, chart.exercise).selectOption('machine');
    await expect(page.locator('.journal-chart')).toContainText('250 kg');
    console.log('OK atomic rollback, retry, separate equipment volumes');

    const second = await ctx.newPage();
    await second.goto(url);
    await expect(history(second)).toHaveCount(2);
    await edit(page, 1, 'reps', '9');
    await edit(second, 1, 'kg', '27,5');
    await saveEdit(page);
    await saveEdit(second);
    await expect(history(page).nth(1)).toContainText('27,5 kg × 9');
    await edit(page, 1, 'kg', '30');
    await edit(second, 1, 'kg', '32,5');
    await saveEdit(page);
    await button(journal(second), it.save).click();
    await expect(journal(second).getByText(it.conflict, { exact: true })).toBeVisible();
    assert.equal((await snapshot(second)).sets.find(set => set.exercise === 'machine').kg, 30);
    await button(journal(second), it.apply).click();
    await expect(history(page).nth(1)).toContainText('32,5 kg × 9');
    console.log('OK independent edits merge and overlapping edits require explicit resolution');

    await edit(second, 1, 'reps', '8');
    await edit(page, 1, 'status', 'voided');
    await saveEdit(page);
    await button(journal(second), it.save).click();
    await expect(journal(second).getByText(it.statusConflict, { exact: false })).toBeVisible();
    await button(journal(second), it.keep).click();
    await expect(history(second).nth(1)).toContainText(it.voided);
    await edit(page, 1, 'status', 'completed');
    await saveEdit(page);
    await expect(history(second).nth(1)).toContainText('32,5 kg × 9');
    console.log('OK void vs concurrent edit, preservation and restoration');

    await choice(journal(page), it.exercise).selectOption('bench');
    await field(journal(page), it.kg).fill('');
    await field(journal(page), it.reps).fill('1');
    await button(journal(page), it.add).click();
    await expect(history(page)).toHaveCount(3);
    await choice(page, chart.exercise).selectOption('bench');
    await expect(page.locator('.journal-chart')).toContainText(chart.unknown);
    const missingLoad = (await snapshot(page)).sets.find(set => set.kg === null);
    assert.equal(missingLoad.reps, 1);
    console.log('OK missing load preserves the set and does not appear as zero volume');

    const guided = page.getByRole('region', { name: demo.heading, exact: true });
    await page.getByText(shell.example, { exact: true }).click();
    await button(guided, demo.start).click();
    await button(guided, demo.recordFirst).click();
    await expect(history(second)).toHaveCount(4);
    await guided.getByRole('link', { name: demo.openTimer }).click();
    await expect(page.locator('#workout-timer-heading')).toBeFocused();
    await field(page, timer.duration).fill('30');
    await button(page, timer.startCountdown).click();
    await expect(page.getByRole('timer')).toBeVisible();

    await choice(guided, demo.choice).selectOption('today');
    const beforeRetry = await snapshot(page);
    await page.evaluate(() => {
      const original = IDBObjectStore.prototype.add;
      IDBObjectStore.prototype.add = function (...args) {
        if (this.name !== 'operations') return original.apply(this, args);
        IDBObjectStore.prototype.add = original;
        throw new DOMException('Test write failure', 'QuotaExceededError');
      };
    });
    await button(guided, demo.recordSecond).click();
    await expect(guided.getByRole('alert')).toHaveText(demo.saveError);
    assert.deepEqual(await snapshot(page), beforeRetry);
    await button(guided, demo.retry).click();
    await expect(guided.getByRole('heading', { name: demo.complete })).toBeVisible();
    await guided.getByRole('link', { name: demo.openJournal }).click();
    await expect(page.locator('#local-journal-heading')).toBeFocused();
    await expect(history(page)).toHaveCount(5);
    await page.reload();
    await expect(history(page)).toHaveCount(5);
    const afterWorkout = await snapshot(page);
    assert.equal(afterWorkout.operationCount, beforeRetry.operationCount + 1);
    assert.ok(afterWorkout.sets.some(set => set.exercise === 'machine' && set.kg === 25 && set.reps === 10));
    console.log('OK guided workout, timer, equipment change, write retry and persisted history');

    const profileForm = page.locator('.profile-questionnaire');
    await field(profileForm, profileLabels.goal).selectOption('muscle');
    await field(profileForm, profileLabels.experience).selectOption('starting');
    await field(profileForm, profileLabels.noneFamiliar).check();
    await field(profileForm, profileLabels.days).fill('1');
    await field(profileForm, profileLabels.minutes).fill('25');
    await field(profileForm, profileLabels.setting).selectOption('gym');
    await field(profileForm, profileLabels.machine).check();
    const movementsToAvoid = profileForm.getByRole('group', { name: profileLabels.avoid, exact: true });
    await field(movementsToAvoid, profileLabels.avoidBench).check();
    await button(profileForm, profileLabels.review).click();
    await page.getByText(shell.example, { exact: true }).click();
    await expect(guided).toContainText(demo.machinePlan);
    await button(guided, demo.start).click();
    await button(guided, demo.recordFirst).click();
    await expect(history(page)).toHaveCount(6);
    await expect(choice(guided, demo.choice)).toHaveCount(0);

    await button(profileForm, profileLabels.edit).click();
    await field(profileForm, profileLabels.bodyweight).check();
    await button(profileForm, profileLabels.review).click();
    await button(guided, demo.recordSecond).click();
    await expect(history(page)).toHaveCount(7);
    await expect(guided).toContainText(demo.noCompatibleExercise);
    await expect(button(guided, demo.restart)).toHaveCount(0);
    const previousIds = new Set(afterWorkout.sets.map(set => set.id));
    const newSets = (await snapshot(page)).sets.filter(set => !previousIds.has(set.id));
    assert.deepEqual(newSets.map(set => set.exercise), ['machine', 'machine']);
    console.log('OK the confirmed profile limits exercise choices without changing a workout already underway');

    for (const locale of ['de', 'en', 'it']) {
      const translated = require('../src/locales/journal-' + locale + '.json');
      await page.locator('.language-picker select').selectOption(locale);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { name: translated.heading, exact: true })).toBeVisible();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    assert.deepEqual(errors, []);
    console.log('OK Italian, German and English at 360 px; no uncaught page errors');
  } finally {
    if (ctx) await ctx.close();
    await new Promise(resolve => server.httpServer.close(resolve));
    await rm(profile, { recursive: true, force: true });
  }
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
