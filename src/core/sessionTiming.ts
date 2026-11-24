type SessionGap = {
  recoverySeconds: number;
  changeSeconds: number;
  overlap: boolean;
};

type SessionTiming = {
  preparationSeconds: number;
  setSeconds: readonly number[];
  gaps: readonly SessionGap[];
};

export function estimateSessionSeconds({ preparationSeconds, setSeconds, gaps }: SessionTiming): number {
  if (setSeconds.length === 0 || gaps.length !== setSeconds.length - 1) {
    throw new RangeError('A session needs one interval between each pair of sets.');
  }

  let total = validSeconds(preparationSeconds);
  for (const seconds of setSeconds) total += validSeconds(seconds);
  for (const gap of gaps) {
    const recovery = validSeconds(gap.recoverySeconds);
    const change = validSeconds(gap.changeSeconds);
    total += gap.overlap ? Math.max(recovery, change) : recovery + change;
  }
  return validSeconds(total);
}

function validSeconds(seconds: number): number {
  if (!Number.isSafeInteger(seconds) || seconds < 0) {
    throw new RangeError('Durations must be whole nonnegative seconds.');
  }
  return seconds;
}
