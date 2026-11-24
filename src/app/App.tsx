import { useEffect, useState } from 'react';
import { messages, type Locale } from '../locales/messages';
import type { OfflineStatus } from '../registerOffline';
import { useLocalJournal } from './journalUpdates';
import { LegacyJournal } from './LegacyJournal';
import { LocalJournal } from './LocalJournal';
import type { PlanProfile } from '../core/planSelection';
import { ProfileQuestionnaire } from './ProfileQuestionnaire';
import { SessionDemo } from './SessionDemo';
import { StrengthExampleSession } from './StrengthExampleSession';
import type { StrengthDayIndex } from './strengthExample';
import { WorkoutTimer } from './WorkoutTimer';

type AppProps = { locale?: Locale; offlineStatus?: OfflineStatus | undefined };

export function App({ locale = 'it', offlineStatus }: AppProps) {
  const journal = useLocalJournal();
  const [language, setLanguage] = useState(locale);
  const [profile, setProfile] = useState<PlanProfile>();
  const [strengthDay, setStrengthDay] = useState<StrengthDayIndex | null>(null);
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
      <ProfileQuestionnaire locale={language} onReview={setProfile} sessionOpen={strengthDay !== null}
        onStart={day => setStrengthDay(current => current ?? day)} />
      {strengthDay !== null && <StrengthExampleSession day={strengthDay}
        allowMachine={Boolean(profile?.equipment.includes('machine') && !profile.avoidedExercises.includes('avoidMachinePress'))}
        locale={language} journal={journal}
        onClose={() => {
          setStrengthDay(null);
          document.getElementById('profile-start')?.focus();
        }} />}
      <details className="example-panel">
        <summary>{text.example}</summary>
        <SessionDemo locale={language} profile={profile} journal={journal} />
      </details>
      <WorkoutTimer locale={language} />
      <LocalJournal locale={language} journal={journal} />
      <LegacyJournal locale={language} />
      {offlineStatus && (
        <p role="status">{offlineStatus === 'ready' ? text.offlineReady : text.offlineUnavailable}</p>
      )}
    </main>
  );
}
