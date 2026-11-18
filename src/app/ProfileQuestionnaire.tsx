import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../locales/messages';
import de from '../locales/profile-de.json';
import en from '../locales/profile-en.json';
import it from '../locales/profile-it.json';
import questions from './profileQuestions.json';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;

export function ProfileQuestionnaire({ locale }: { locale: Locale }) {
  const text: Record<string, string> = translations[locale];
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [reviewing, setReviewing] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    if (reviewing) summary.current?.focus();
    else form.current?.querySelector<HTMLElement>('select, input')?.focus();
  }, [reviewing]);

  function setAnswer(id: string, values: string[]) {
    setAnswers((current) => ({ ...current, [id]: values }));
  }

  function toggle(id: string, option: string, checked: boolean, exclusive?: string) {
    const current = answers[id] ?? [];
    if (!checked) setAnswer(id, current.filter((value) => value !== option));
    else if (option === exclusive) setAnswer(id, [option]);
    else setAnswer(id, [...current.filter((value) => value !== exclusive), option]);
  }

  return (
    <details className="session-demo profile-questionnaire">
      <summary>{text.heading}</summary>
      <p>{text.intro}</p>
      {reviewing ? (
        <>
          <h3 tabIndex={-1} ref={summary}>{text.result}</h3>
          <dl>
            {questions.map((question) => (
              <div key={question.id}>
                <dt>{text[question.id]}</dt>
                <dd>{answers[question.id]?.map((value) =>
                  question.kind === 'integer' ? Number(value).toLocaleString(locale) : text[value],
                ).join(', ')}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={() => setReviewing(false)}>{text.edit}</button>
        </>
      ) : (
        <form ref={form} onSubmit={(event) => {
          event.preventDefault();
          moved.current = true;
          setReviewing(true);
        }}>
          {questions.map((question) => {
            const values = answers[question.id] ?? [];
            if (question.kind === 'multiple') {
              return (
                <fieldset key={question.id}>
                  <legend>{text[question.id]}</legend>
                  {question.options?.map((option, index) => (
                    <label key={option} className="profile-option">
                      <input type="checkbox" checked={values.includes(option)}
                        required={index === 0 && values.length === 0}
                        onChange={(event) => toggle(question.id, option, event.target.checked, question.exclusive)} />
                      {text[option]}
                    </label>
                  ))}
                </fieldset>
              );
            }
            return (
              <label key={question.id} className="profile-field">
                {text[question.id]}
                {question.kind === 'choice' ? (
                  <select required value={values[0] ?? ''} onChange={(event) => setAnswer(question.id, [event.target.value])}>
                    <option value="" disabled>{text.choose}</option>
                    {question.options?.map((option) => <option key={option} value={option}>{text[option]}</option>)}
                  </select>
                ) : (
                  <input type="number" required min={question.min} max={question.max} step="1" inputMode="numeric"
                    value={values[0] ?? ''} onChange={(event) => setAnswer(question.id, [event.target.value])} />
                )}
              </label>
            );
          })}
          <button type="submit">{text.review}</button>
        </form>
      )}
    </details>
  );
}
