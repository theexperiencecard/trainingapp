// Run with --storage to exercise the storage API, or after npm run build to exercise the production UI.
const assert = require('node:assert/strict');
const { chromium, expect } = require('playwright/test');
const labels = require('../src/locales/journal-it.json');
const chartLabels = require('../src/locales/chart-it.json');
const profile = require('../src/locales/profile-it.json');
const week = require('../src/locales/week-it.json');
const shell = require('../src/locales/it.json');

const dbName = 'trainingapp-synthetic-journal';
const monday = '2026-11-23';
const thursday = '2026-11-26';
const legacyDay = '2026-11-16';
const sessionId = 'synthetic:' + legacyDay;
const oldSession = {
  id: sessionId, owner: 'synthetic', actualDay: legacyDay, plannedDay: legacyDay,
  nextPosition: 2, modifiedAt: 23, createdAt: 10,
};
const oldSet = {
  id: 'synthetic:set:original', owner: 'synthetic', sessionId, day: legacyDay, exercise: 'bench',
  catalogVersion: 1, configuration: 'flat-bench-barbell', convention: 'total-including-bar', unit: 'kg',
  position: 1, kg: 42.5, reps: 8, rir: null, status: 'completed',
  revisions: { kg: 3, reps: 1, rir: 1, status: 1 }, createdAt: 10, modifiedAt: 23,
};
const oldIntent = { type: 'edit', statusRevision: 1, edits: [{ field: 'kg', value: 42.5, baseRevision: 2 }] };
const oldOperation = { id: 'old-edit', owner: 'synthetic', setId: oldSet.id, intent: oldIntent,
  signature: JSON.stringify([oldSet.id, oldIntent]), modifiedAt: 23 };

async function seedV1(page, url) {
  await page.route('**/walk-seed', route => route.fulfill({ contentType: 'text/html', body: '<title>Fixture</title>' }));
  await page.goto(url + '/walk-seed');
  await page.evaluate(({ dbName, oldSet, oldSession, oldOperation }) => new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, 1);
    open.onupgradeneeded = () => {
      for (const [name, value] of [['sets', oldSet], ['sessions', oldSession], ['operations', oldOperation]]) {
        open.result.createObjectStore(name, { keyPath: 'id' }).add(value);
      }
    };
    open.onerror = () => reject(open.error);
    open.onsuccess = () => { open.result.close(); resolve(); };
  }), { dbName, oldSet, oldSession, oldOperation });
}

function snapshot(page) {
  return page.evaluate(name => new Promise((resolve, reject) => {
    const open = indexedDB.open(name);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const stores = Array.from(db.objectStoreNames);
      const tx = db.transaction(stores);
      const data = { version: db.version };
      for (const store of stores) {
        const read = tx.objectStore(store).getAll();
        read.onsuccess = () => { data[store] = read.result; };
      }
      tx.onabort = () => { db.close(); reject(tx.error); };
      tx.oncomplete = () => { db.close(); resolve(data); };
    };
  }), dbName);
}

async function failNextOperation(page) {
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args) {
      if (this.name !== 'operations') return original.apply(this, args);
      IDBObjectStore.prototype.add = original;
      throw new DOMException('Injected write failure', 'QuotaExceededError');
    };
  });
}

function checkLegacy(state) {
  assert.equal(state.version, 2);
  assert.deepEqual(state.sets, [oldSet]);
  assert.deepEqual(state.sessions.find(row => row.id === sessionId), oldSession);
  assert.deepEqual(state.operations.find(row => row.id === oldOperation.id), oldOperation);
}

async function storageRegression(page) {
  const add = (key, seconds) => page.evaluate(async ({ key, seconds, monday }) => {
    const { addWalk } = await import('/src/storage/localJournal.ts');
    await addWalk(key, monday, seconds, 'moderate');
  }, { key, seconds, monday });
  await Promise.all([add('same-walk', 600), add('same-walk', 600), add('second-walk', 60)]);
  await assert.rejects(add('same-walk', 360));
  const beforeFailure = await snapshot(page);
  checkLegacy(beforeFailure);
  assert.equal(beforeFailure.walks.length, 2);
  assert.equal(new Set(beforeFailure.walks.map(row => row.position)).size, 2);
  assert.equal(beforeFailure.operations.length, 3);

  await failNextOperation(page);
  await assert.rejects(add('retry-walk', 120));
  assert.deepEqual(await snapshot(page), beforeFailure);
  await add('retry-walk', 120);
  const after = await snapshot(page);
  assert.equal(after.walks.length, 3);
  assert.equal(after.operations.length, 4);
  assert.ok(after.walks.every(row => row.sessionId === 'synthetic:' + monday && row.activity === 'walking'));
  console.log('OK v1 migration, preserved revisions, duplicate and concurrent writes, rollback and retry');
}

async function openPlannedWalk(page, goal = 'general', experience = 'returning') {
  const form = page.locator('.profile-questionnaire');
  const field = key => form.getByLabel(profile[key], { exact: true });
  await field('goal').selectOption(goal);
  await field('experience').selectOption(experience);
  if (experience === 'regular') {
    const familiar = form.getByRole('group', { name: profile.familiar, exact: true });
    for (const move of ['press', 'squat', 'row']) await familiar.getByLabel(profile[move], { exact: true }).check();
  }
  await field('walk').check();
  await field('aerobicActivity').selectOption('aerobicRegular');
  await field('days').fill('2');
  await field('spacing').selectOption('canSpace');
  await field('minutes').fill('45');
  await field('setting').selectOption('gym');
  await field('machine').check();
  await field('dumbbells').check();
  await field('noAvoidPreference').check();
  await form.getByRole('button', { name: profile.review }).click();
  await form.getByText(week.open, { exact: true }).click();
  await form.getByRole('link', { name: labels.walkLink }).first().click();
  await expect(page.locator('#walk-entry-heading')).toBeFocused();
}

async function uiRegression(page, url) {
  await page.goto(url);
  await expect(page.getByText(shell.offlineReady, { exact: true })).toBeVisible();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await expect(page.getByText('42,5 kg', { exact: false }).first()).toBeVisible();
  await page.context().setOffline(true);
  await openPlannedWalk(page);
  const compareWeek = page.getByRole('combobox', { name: week.walkComparison });
  const comparison = page.getByRole('region', { name: week.walkComparison });
  const compared = recorded => week.walkCompared.replace('{recorded}', recorded).replace('{planned}', '20');
  await expect(comparison).toContainText(compared('0 min'));
  const migrated = await snapshot(page);
  checkLegacy(migrated);
  assert.deepEqual(migrated.walks, []);

  const form = page.getByRole('form', { name: labels.walkEntry });
  const history = page.getByRole('region', { name: labels.walkHistory });
  const field = name => form.getByLabel(name, { exact: true });
  const submit = name => form.getByRole('button', { name, exact: true }).click();
  async function enter(day, minutes, intensity) {
    await field(labels.walkDay).fill(day);
    await field(labels.walkMinutes).fill(minutes);
    await form.getByRole('combobox', { name: labels.walkIntensity }).selectOption(intensity);
    await submit(labels.walkSave);
  }
  const minutesFor = label => history.getByText(label, { exact: true }).locator('xpath=following-sibling::dd[1]');
  await failNextOperation(page);
  await enter(monday, '10', 'moderate');
  await expect(page.getByRole('alert')).toBeVisible();
  assert.deepEqual(await snapshot(page), migrated);
  await submit(labels.walkRetry);
  await expect(minutesFor(labels.walkTotal)).toHaveText('10 min');
  await enter(thursday, '6', 'light');
  await expect(minutesFor(labels.walkTotal)).toHaveText('16 min');
  await enter(thursday, '2', 'moderate');
  await expect(minutesFor(labels.walkTotal)).toHaveText('18 min');
  await compareWeek.selectOption(monday);
  await expect(comparison).toContainText(compared('18 min'));
  await enter('2026-11-30', '1,5', 'unknown');
  await expect.poll(async () => (await snapshot(page)).walks.length).toBe(4);
  await page.reload();
  const selectWeek = page.getByRole('combobox', { name: labels.week });
  await selectWeek.selectOption(monday);
  await expect(minutesFor(labels.walkTotal)).toHaveText('18 min');
  await expect(minutesFor(labels.walkLight)).toHaveText('6 min');
  await expect(minutesFor(labels.walkModerate)).toHaveText('12 min');
  await selectWeek.selectOption('2026-11-30');
  await expect(minutesFor(labels.walkUnknown)).toHaveText('1 min 30 s');
  await openPlannedWalk(page);
  await compareWeek.selectOption(monday);
  await expect(comparison).toContainText(compared('18 min'));
  await expect(comparison.getByText(labels.walkModerate).locator('..')).toContainText('12 min');
  await expect(comparison.getByText(labels.walkLight).locator('..')).toContainText('6 min');
  await compareWeek.selectOption('2026-11-30');
  await expect(comparison).toContainText(compared('1 min 30 s'));
  await compareWeek.selectOption(legacyDay);
  await expect(comparison).toContainText(compared('0 min'));
  const final = await snapshot(page);
  checkLegacy(final);
  assert.equal(final.operations.length, 5);
  assert.deepEqual(final.walks.map(row => [row.day, row.seconds, row.intensity]).sort(),
    [[monday, 600, 'moderate'], [thursday, 360, 'light'], [thursday, 120, 'moderate'], ['2026-11-30', 90, 'unknown']].sort());
  console.log('OK planned walk, manual confirmation, rollback and retry, offline history and weekly intensities');
}

async function mixedRegression(page) {
  const nextMonday = '2026-11-30';
  const walks = (await snapshot(page)).walks;
  for (const [goal, experience, day, sets] of [['general', 'returning', 0, 1], ['aerobic', 'regular', 1, 2]]) {
    const trainingDay = sets === 1 ? thursday : nextMonday;
    await page.clock.setFixedTime(new Date(trainingDay + 'T12:00:00Z'));
    await page.reload();
    await openPlannedWalk(page, goal, experience);
    const before = await snapshot(page);
    const overview = page.getByRole('region', { name: week.heading });
    const days = [week.dayA, week.dayB].map(title => overview.getByRole('region', { name: new RegExp(title) }));
    const perMovement = (sets === 1 ? week.plannedSet : week.plannedSets).replace('{count}', String(sets));
    for (const dayOverview of days) {
      await expect(dayOverview.getByRole('listitem')).toHaveText(
        ['goblet', 'machine', 'row', 'bridge', 'deadBug'].map(move => week[move] + ' · ' + perMovement),
      );
      await expect(dayOverview.getByText(week.plannedSets.replace('{count}', String(sets * 5)), { exact: true })).toBeVisible();
    }
    await days[day].getByRole('button', { name: week.startSession }).click();
    const session = page.locator('section[aria-labelledby="week-example-heading"]');
    await expect(overview.getByRole('link', { name: week.resumeSession })).toHaveCount(1);
    await expect(days[1 - day].getByRole('link', { name: week.resumeSession })).toHaveCount(0);
    await days[day].getByRole('link', { name: week.resumeSession }).click();
    await expect(session.getByRole('heading')).toBeFocused();
    assert.deepEqual(await snapshot(page), before);
    for (const exercise of ['goblet', 'machine', 'row', 'bridge', 'deadBug']) {
      for (let i = 0; i < sets; i++) {
        const form = session.locator('form');
        await expect(form.locator('strong')).toHaveText(labels[exercise]);
        const reps = form.getByLabel(exercise === 'deadBug' ? labels.repsPerSide : labels.reps, { exact: true });
        if (exercise === 'goblet') {
          await expect(reps).toHaveValue(sets === 1 ? '8' : String(10 - i));
          await expect(form.getByLabel(labels.kg)).toHaveValue(sets === 1 ? '' : '8');
        } else {
          await expect(reps).toHaveValue('');
          await reps.fill(exercise === 'bridge' ? '12' : '8');
        }
        if (exercise === 'bridge' || exercise === 'deadBug') await expect(form.getByLabel(labels.kg)).toHaveCount(0);
        await form.getByRole('button', { name: labels.add }).click();
      }
    }
    await expect(session.getByRole('heading')).toHaveText(week.musclePartComplete);
    if (sets === 2) await expect(session).toContainText('152 kg');
    await page.reload();
    const after = await snapshot(page);
    const added = after.sets.filter(row => !before.sets.some(previous => previous.id === row.id));
    assert.equal(added.length, sets * 5);
    assert.ok(added.every(row => row.rir === null));
    assert.equal(added.filter(row => row.exercise === 'deadBug' && row.kg === null &&
      row.reps === 8 && row.convention === 'bodyweight-reps-per-side').length, sets);
    assert.deepEqual(after.walks, walks);
  }
  const chart = page.locator('.journal-chart');
  const pickExercise = chart.getByLabel(chartLabels.exercise);
  const pickWeek = page.getByRole('combobox', { name: labels.week });
  await pickWeek.selectOption(nextMonday);
  await pickExercise.selectOption('deadBug');
  await expect(chart.getByRole('heading')).toHaveText(chartLabels.repsTitle);
  await expect(chart.locator('li')).toHaveText([/16 ripetizioni per lato · 2 serie/]);
  await pickWeek.selectOption(monday);
  await expect(chart.locator('li')).toHaveText([/8 ripetizioni per lato · 1 serie/]);
  await pickExercise.selectOption('bridge');
  await expect(chart.locator('li')).toHaveText([/12 ripetizioni · 1 serie/]);
  await pickWeek.selectOption(nextMonday);
  await expect(chart.locator('li')).toHaveText([/24 ripetizioni · 2 serie/]);
  await pickExercise.selectOption('goblet');
  await expect(chart.getByRole('heading')).toHaveText(chartLabels.title);
  await expect(chart.locator('li')).toHaveText([/152 kg · 2 serie/]);
  console.log('OK mixed sessions offline and weekly charts for goblet, bridge and dead bug');
}

async function verify() {
  const storageOnly = process.argv.includes('--storage');
  const { preview, createServer } = await import('vite');
  const options = { host: '127.0.0.1', port: 0 };
  const server = storageOnly
    ? await createServer({ logLevel: 'silent', server: options })
    : await preview({ logLevel: 'silent', preview: options });
  let browser;
  try {
    if (storageOnly) await server.listen();
    const url = 'http://127.0.0.1:' + server.httpServer.address().port;
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    const page = await browser.newPage({ viewport: { width: 360, height: 760 } });
    page.setDefaultTimeout(8000);
    await seedV1(page, url);
    if (storageOnly) await storageRegression(page);
    else {
      await uiRegression(page, url);
      await mixedRegression(page);
    }
  } finally {
    await browser?.close();
    if (storageOnly) await server.close();
    else await new Promise(resolve => server.httpServer.close(resolve));
  }
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
