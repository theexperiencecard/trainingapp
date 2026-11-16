import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { messages } from '../locales/messages';
import { App } from './App';

describe('application shell', () => {
  it.each(['it', 'de', 'en'] as const)('renders the welcome screen in %s', (locale) => {
    const html = renderToStaticMarkup(<App locale={locale} />);

    expect(html).toContain('<main>');
    expect(html).toContain(`<h1>${messages[locale].heading}</h1>`);
    expect(html).toContain(messages[locale].introduction);
  });
});
