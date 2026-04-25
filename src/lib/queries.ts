import { useQuery } from '@tanstack/react-query';
import {
  MOCK_ARCHETYPE,
  MOCK_CURRENT_SEASON,
  MOCK_GAMES,
  MOCK_PLAYER,
  MOCK_SEASONS,
  MOCK_SEASON_AVERAGES,
  MOCK_TEAM_RANKS,
  astTrend,
  ptsTrend,
  tovTrend,
} from '@/mocks/fixtures';
import type { TrendPoint } from '@/types';

// Pretend network latency so loading states are exercised.
const delay = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise((r) => setTimeout(() => r(value), ms));

export const useMe = () => useQuery({ queryKey: ['me'], queryFn: () => delay(MOCK_PLAYER) });

export const useSeasons = () =>
  useQuery({ queryKey: ['seasons'], queryFn: () => delay(MOCK_SEASONS) });

export const useCurrentSeason = () =>
  useQuery({
    queryKey: ['seasons', 'current'],
    queryFn: () => delay(MOCK_CURRENT_SEASON),
  });

export const useArchetype = (seasonId?: string) =>
  useQuery({
    queryKey: ['archetype', seasonId ?? 'current'],
    queryFn: () => delay(MOCK_ARCHETYPE),
  });

export const useSeasonAverages = (seasonId?: string) =>
  useQuery({
    queryKey: ['season-averages', seasonId ?? 'current'],
    queryFn: () => delay(MOCK_SEASON_AVERAGES),
  });

export const useGames = (seasonId?: string) =>
  useQuery({
    queryKey: ['games', { seasonId: seasonId ?? 'current' }],
    queryFn: () => delay(MOCK_GAMES),
  });

export const useLastGame = (seasonId?: string) =>
  useQuery({
    queryKey: ['games', 'last', { seasonId: seasonId ?? 'current' }],
    queryFn: () => delay(MOCK_GAMES[MOCK_GAMES.length - 1]),
  });

export const useGame = (gameId?: string) =>
  useQuery({
    queryKey: ['game', gameId],
    queryFn: () => delay(MOCK_GAMES.find((g) => g.id === gameId) ?? null),
    enabled: !!gameId,
  });

export const useTeamRanks = (seasonId?: string) =>
  useQuery({
    queryKey: ['team-ranks', seasonId ?? 'current'],
    queryFn: () => delay(MOCK_TEAM_RANKS),
  });

export type TrendMetric = 'pts' | 'ast' | 'tov' | 'reb' | 'ts';

const TREND_DATA: Record<TrendMetric, TrendPoint[]> = {
  pts: ptsTrend,
  ast: astTrend,
  tov: tovTrend,
  reb: [],
  ts: [],
};

export const useTrend = (metric: TrendMetric, range: 'last5' | 'season' | 'all' = 'season') =>
  useQuery({
    queryKey: ['trends', { metric, range }],
    queryFn: () => delay(TREND_DATA[metric] ?? []),
  });
