import { useEffect, useState } from 'react';
import { messages, type Locale } from '../locales/messages';
import type { OfflineStatus } from '../registerOffline';
import { LocalJournal } from './LocalJournal';
import { SessionDemo } from './SessionDemo';
import { WorkoutTimer } from './WorkoutTimer';

type AppProps = { locale?: Locale; offlineStatus?: OfflineStatus | undefined };

export function App({ locale = 'it', offlineStatus }: AppProps) {
  const [language, setLanguage] = useState(locale);
  const text = messages[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = text.title;
  }, [language, text.title]);

  return (
    <main>
      <header>
        <label className="language-picker">
          {text.language}
          <select value={language} onChange={(event) => {
            const value = event.target.value;
            if (value === 'it' || value === 'de' || value === 'en') setLanguage(value);
          }}>
            <option lang="it" value="it">{messages.it.languageName}</option>
            <option lang="de" value="de">{messages.de.languageName}</option>
            <option lang="en" value="en">{messages.en.languageName}</option>
          </select>
        </label>
        <h1>{text.heading}</h1>
      </header>
      <LocalJournal locale={language} />
      <SessionDemo locale={language} />
      <WorkoutTimer locale={language} />
      {offlineStatus && (
        <p role="status">{offlineStatus === 'ready' ? text.offlineReady : text.offlineUnavailable}</p>
      )}
    </main>
  );
}
