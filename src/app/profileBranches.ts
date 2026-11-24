import questions from './profileQuestions.json';

type ProfileAnswers = Record<string, string[]>;

export function visibleProfileQuestions(answers: ProfileAnswers) {
  const goal = answers.goal?.[0];
  const days = Number(answers.days?.[0]);
  return questions.filter(({ branch }) => {
    if (branch === 'aerobicGoal') return goal === 'aerobic' || goal === 'general';
    if (branch === 'multipleDays') return Number.isInteger(days) && days >= 2 && days <= 7;
    return true;
  });
}

export function updateProfileAnswer(answers: ProfileAnswers, id: string, values: string[]): ProfileAnswers {
  const next = { ...answers, [id]: values };
  const visible = new Set(visibleProfileQuestions(next).map((question) => question.id));
  return Object.fromEntries(Object.entries(next).filter(([key]) => visible.has(key)));
}
