import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../locales/messages';
import it from '../locales/demo-it.json';
import de from '../locales/demo-de.json';
import en from '../locales/demo-en.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;
type Exercise = 'bench' | 'machine';
type Choice = 'keepBench' | 'today' | 'alsoThursday';

const setVolume = { bench: 40 * 12, machine: 25 * 10 };
const choices: readonly Choice[] = ['keepBench', 'today', 'alsoThursday'];
const exercises: readonly Exercise[] = ['bench', 'machine'];

export function SessionDemo({ locale }: { locale: Locale }) {
  const text = translations[locale];
  const [logged, setLogged] = useState<Exercise[]>([]);
  const [choice, setChoice] = useState<Choice>('keepBench');
  const current: Exercise = choice === 'keepBench' ? 'bench' : 'machine';
  const thursday: Exercise = choice === 'alsoThursday' ? 'machine' : 'bench';
  const complete = logged.length === 2;
  const currentTitle = [text.first, text.second, text.complete][logged.length];
  const setLabel = { bench: text.benchSet, machine: text.machineSet };

  const previousCount = useRef(logged.length);
  const currentHeading = useRef<HTMLHeadingElement>(null);
  const nextExercise = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (logged.length !== previousCount.current) {
      currentHeading.current?.focus();
      previousCount.current = logged.length;
    }
  }, [logged.length]);

  function restart() {
    setLogged([]);
    setChoice('keepBench');
  }

  return (
    <section className="session-demo" aria-labelledby="demo-heading">
      <h2 id="demo-heading">{text.heading}</h2>
      <p>{text.intro}</p>

      <div className="demo-current">
        <h3 ref={currentHeading} tabIndex={-1}>{currentTitle}</h3>
        {logged.length === 1 && (
          <label className="demo-choice">
            {text.choice}
            <select value={choice} onChange={(event) => {
              const selected = choices.find((option) => option === event.target.value);
              if (selected) setChoice(selected);
            }}>
              {choices.map((option) => <option key={option} value={option}>{text[option]}</option>)}
            </select>
          </label>
        )}
        {!complete && (
          <>
            <p>{text[current]} · {setLabel[current]}</p>
            <button type="button" onClick={() => setLogged([...logged, current])}>
              {logged.length === 0 ? text.recordFirst : text.recordSecond}
            </button>
          </>
        )}
      </div>

      {logged.length > 0 && (
        <div className="demo-history">
          <h3>{text.history}</h3>
          <ol>
            {logged.map((exercise, index) => (
              <li key={index}>{text[exercise]} · {setLabel[exercise]}</li>
            ))}
          </ol>
          <h3>{text.volume}</h3>
          <dl>
            {exercises.filter((exercise) => logged.includes(exercise)).map((exercise) => (
              <div key={exercise}>
                <dt>{exercise === 'bench' ? text.benchVolume : text.machineVolume}</dt>
                <dd>{setVolume[exercise] * logged.filter((item) => item === exercise).length} {text.unit}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="demo-next">
        <h3>{text.next}</h3>
        <p aria-live="polite" ref={nextExercise} tabIndex={-1}>{text[thursday]}</p>
        {complete && thursday === 'machine' && (
          <button className="demo-secondary" type="button" onClick={() => {
            setChoice('today');
            nextExercise.current?.focus();
          }}>
            {text.restore}
          </button>
        )}
      </div>
      {logged.length > 0 && (
        <button className="demo-secondary" type="button" onClick={restart}>{text.restart}</button>
      )}
    </section>
  );
}
