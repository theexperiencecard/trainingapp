import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { messages } from '../locales/messages';
import { App } from './App';

const catalogs = import.meta.glob<Record<string, string>>('../locales/*-*.json', {
  eager: true,
  import: 'default',
});

describe('application shell', () => {
  it.each(['it', 'de', 'en'] as const)('renders the welcome screen in %s', (locale) => {
    const html = renderToStaticMarkup(<App locale={locale} />);

    expect(html).toContain('<main>');
    expect(html).toContain(`<h1>${messages[locale].heading}</h1>`);
    expect(html).toContain(messages[locale].language);
    expect(html).toContain(catalogs[`../locales/timer-${locale}.json`]!.heading);
  });
});

describe('session preview', () => {
  const demo = (locale: string) => catalogs[`../locales/demo-${locale}.json`]!;

  it.each(['it', 'de', 'en'] as const)('renders the sample session in %s', (locale) => {
    const html = renderToStaticMarkup(<App locale={locale} />);
    const text = demo(locale);
    expect(html).toContain(text.heading);
    expect(html).toContain(text.first);
    expect(html).toContain(text.recordFirst);
  });

  it.each(Object.keys(catalogs).filter((path) => path.endsWith('-it.json')))(
    'has complete German and English translations for %s', (path) => {
      const reference = catalogs[path]!;
      for (const locale of ['it', 'de', 'en']) {
        const translated = catalogs[path.replace('-it.json', `-${locale}.json`)]!;
        expect(Object.keys(translated).sort()).toEqual(Object.keys(reference).sort());
        for (const value of Object.values(translated)) expect(value.trim()).not.toBe('');
      }
    },
  );
});
