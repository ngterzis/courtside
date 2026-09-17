import { describe, expect, it } from 'vitest';
import { fgPct, fmt1, ftPct, pct, threePct, tsPct } from './stats';
import type { GameStats } from '@/types';
import { MOCK_GAMES, MOCK_SEASON_AVERAGES } from '@/mocks/fixtures';

const line = (overrides: Partial<GameStats> = {}): GameStats => ({
  points: 0,
  rebounds: 0,
  assists: 0,
  steals: 0,
  blocks: 0,
  turnovers: 0,
  fouls: 0,
  fgMade: 0,
  fgAttempted: 0,
  threeMade: 0,
  threeAttempted: 0,
  ftMade: 0,
  ftAttempted: 0,
  ...overrides,
});

describe('shooting percentages', () => {
  it('divides makes by attempts', () => {
    const s = line({ fgMade: 6, fgAttempted: 12, threeMade: 2, threeAttempted: 5, ftMade: 3, ftAttempted: 4 });

    expect(fgPct(s)).toBe(0.5);
    expect(threePct(s)).toBe(0.4);
    expect(ftPct(s)).toBe(0.75);
  });

  it('returns 0 instead of NaN when there are no attempts', () => {
    const s = line();

    expect(fgPct(s)).toBe(0);
    expect(threePct(s)).toBe(0);
    expect(ftPct(s)).toBe(0);
  });
});

describe('tsPct', () => {
  it('computes PTS / (2 × (FGA + 0.44 × FTA))', () => {
    // 20 / (2 × (15 + 0.44 × 5)) = 20 / 34.4
    expect(tsPct(line({ points: 20, fgAttempted: 15, ftAttempted: 5 }))).toBeCloseTo(0.5814, 4);
  });

  it('counts free throws when there are no field goal attempts', () => {
    // 2 / (2 × 0.44 × 2)
    expect(tsPct(line({ points: 2, ftAttempted: 2 }))).toBeCloseTo(1.1364, 4);
  });

  it('returns 0 when the player took no shots', () => {
    expect(tsPct(line())).toBe(0);
  });

  it('agrees with the precomputed values in the mock data', () => {
    for (const { id, stats } of MOCK_GAMES) {
      expect(tsPct(stats), `game ${id}`).toBeCloseTo(stats.tsPct!, 3);
    }
    expect(tsPct(MOCK_SEASON_AVERAGES)).toBeCloseTo(MOCK_SEASON_AVERAGES.tsPct!, 2);
  });
});

describe('formatting', () => {
  it('pct renders a ratio as a percentage', () => {
    expect(pct(0.5814)).toBe('58%');
    expect(pct(0.5814, 1)).toBe('58.1%');
    expect(pct(0)).toBe('0%');
  });

  it('fmt1 renders one decimal place', () => {
    expect(fmt1(14.6)).toBe('14.6');
    expect(fmt1(5)).toBe('5.0');
  });
});
