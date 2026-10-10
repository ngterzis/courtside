import type { GameStats } from '@/types';

export const fgPct = (s: GameStats) => (s.fgAttempted === 0 ? 0 : s.fgMade / s.fgAttempted);

export const threePct = (s: GameStats) =>
  s.threeAttempted === 0 ? 0 : s.threeMade / s.threeAttempted;

export const ftPct = (s: GameStats) => (s.ftAttempted === 0 ? 0 : s.ftMade / s.ftAttempted);

// True Shooting % = PTS / (2 * (FGA + 0.44 * FTA))
export const tsPct = (s: GameStats) => {
  const denom = 2 * (s.fgAttempted + 0.44 * s.ftAttempted);
  return denom === 0 ? 0 : s.points / denom;
};

export const pct = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;

export const fmt1 = (n: number) => n.toFixed(1);
