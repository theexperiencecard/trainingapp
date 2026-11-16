import { messages, type Locale } from '../locales/messages';

export function App({ locale = 'it' }: { locale?: Locale }) {
  const text = messages[locale];

  return (
    <main>
      <h1>{text.heading}</h1>
      <p>{text.introduction}</p>
    </main>
  );
}
