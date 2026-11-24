import type { PlanProfile } from '../core/planSelection';
import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '../locales/messages';
import de from '../locales/profile-de.json';
import en from '../locales/profile-en.json';
import it from '../locales/profile-it.json';
import { updateProfileAnswer, visibleProfileQuestions } from './profileBranches';
import { planProfileFromAnswers, profileDirection } from './profileDirection';
import { WeekPreview } from './WeekPreview';
import { pressComparison } from './pressComparison';

const translations = { it, de, en } satisfies Record<Locale, typeof it>;

type ProfileQuestionnaireProps = {
  locale: Locale;
  onReview: (profile: PlanProfile) => void;
};

export function ProfileQuestionnaire({ locale, onReview }: ProfileQuestionnaireProps) {
  const text: Record<string, string> = translations[locale];
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [reviewing, setReviewing] = useState(false);
  const direction = reviewing ? profileDirection(answers) : null;
  const comparison = reviewing ? pressComparison(answers) : null;
  const questions = visibleProfileQuestions(answers);
  const fieldPrefix = useId();
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    if (reviewing) summary.current?.focus();
    else form.current?.querySelector<HTMLElement>('select, input')?.focus();
  }, [reviewing]);

  function setAnswer(id: string, values: string[]) {
    setAnswers((current) => updateProfileAnswer(current, id, values));
  }

  function toggle(id: string, option: string, checked: boolean, exclusive?: string) {
    const current = answers[id] ?? [];
    if (!checked) setAnswer(id, current.filter((value) => value !== option));
    else if (option === exclusive) setAnswer(id, [option]);
    else setAnswer(id, [...current.filter((value) => value !== exclusive), option]);
  }

  return (
    <details className="session-demo profile-questionnaire" open>
      <summary>{text.heading}</summary>
      <p>{text.intro}</p>
      {reviewing ? (
        <>
          <h3 tabIndex={-1} ref={summary}>{text.result}</h3>
          {direction ? (
            <section aria-label={text.direction}>
              <h4>{text.direction}</h4>
              <p><strong>{text[direction.goal]}</strong></p>
              <p>{text[direction.startingPoint]}</p>
            </section>
          ) : (
            <p>{text.goalNeeded}</p>
          )}
          {direction && <WeekPreview answers={answers} locale={locale} />}
          <details>
            <summary>{text.answers}</summary>
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
          </details>
          {comparison && (
            <details>
              <summary>{text.comparePress}</summary>
              <dl>
                <dt>{text.avoidBench}</dt>
                <dd>{text[comparison.bench]}</dd>
                <dt>{text.avoidMachinePress}</dt>
                <dd>{text[comparison.machine]}</dd>
              </dl>
              {comparison.bench === 'checkEquipment' || comparison.machine === 'checkEquipment' ? (
                <p>{comparison.goal === 'strength' ? text.compareStrength : text.compareMuscle}</p>
              ) : (
                <p>{text.noPressMatch}</p>
              )}
            </details>
          )}
          <button type="button" onClick={() => setReviewing(false)}>{text.edit}</button>
        </>
      ) : (
        <form ref={form} onSubmit={(event) => {
          event.preventDefault();
          moved.current = true;
          setReviewing(true);
          onReview(planProfileFromAnswers(answers));
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
            const fieldId = fieldPrefix + question.id;
            return (
              <div key={question.id} className="profile-field">
                <label htmlFor={fieldId}>{text[question.id]}</label>
                {question.kind === 'choice' ? (
                  <select id={fieldId} required value={values[0] ?? ''} onChange={(event) => setAnswer(question.id, [event.target.value])}>
                    <option value="" disabled>{text.choose}</option>
                    {question.options?.map((option) => <option key={option} value={option}>{text[option]}</option>)}
                  </select>
                ) : (
                  <input id={fieldId} type="number" required min={question.min} max={question.max} step="1" inputMode="numeric"
                    value={values[0] ?? ''} onChange={(event) => setAnswer(question.id, [event.target.value])} />
                )}
              </div>
            );
          })}
          <button type="submit">{text.review}</button>
        </form>
      )}
    </details>
  );
}
