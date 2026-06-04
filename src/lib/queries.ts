import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './api';
import type {
  Archetype,
  Game,
  Notification,
  Player,
  Season,
  SeasonAverages,
  TeamRank,
} from '@/types';

export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<Player>('/api/me'),
  });

export const useSeasons = () =>
  useQuery({
    queryKey: ['seasons'],
    queryFn: () => apiFetch<Season[]>('/api/seasons'),
  });

export const useCurrentSeason = () =>
  useQuery({
    queryKey: ['seasons', 'current'],
    queryFn: () => apiFetch<Season>('/api/seasons/current'),
  });

export const useArchetype = (seasonId?: string) =>
  useQuery({
    queryKey: ['archetype', seasonId ?? 'current'],
    queryFn: () =>
      apiFetch<Archetype>(
        `/api/me/archetype${seasonId ? `?seasonId=${seasonId}` : ''}`,
      ),
  });

export const useArchetypeHistory = () =>
  useQuery({
    queryKey: ['archetype', 'history'],
    queryFn: () => apiFetch<Archetype[]>('/api/me/archetype/history'),
  });

export const useSeasonAverages = (seasonId?: string) =>
  useQuery({
    queryKey: ['season-averages', seasonId ?? 'current'],
    queryFn: () =>
      apiFetch<SeasonAverages>(
        `/api/me/season-averages${seasonId ? `?seasonId=${seasonId}` : ''}`,
      ),
  });

export const useGames = (seasonId?: string) =>
  useQuery({
    queryKey: ['games', { seasonId: seasonId ?? 'current' }],
    queryFn: async () => {
      const data = await apiFetch<{ games: Game[]; total: number }>(
        `/api/me/games${seasonId ? `?seasonId=${seasonId}` : ''}`,
      );
      return data.games;
    },
  });

export const useLastGame = (seasonId?: string) =>
  useQuery({
    queryKey: ['games', 'last', { seasonId: seasonId ?? 'current' }],
    queryFn: () =>
      apiFetch<Game | null>(
        `/api/me/games/last${seasonId ? `?seasonId=${seasonId}` : ''}`,
      ),
  });

export const useGame = (gameId?: string) =>
  useQuery({
    queryKey: ['game', gameId],
    queryFn: () => apiFetch<Game>(`/api/games/${gameId}`),
    enabled: !!gameId,
  });

export const useTeamRanks = (seasonId?: string) =>
  useQuery({
    queryKey: ['team-ranks', seasonId ?? 'current'],
    queryFn: () =>
      apiFetch<TeamRank[]>(
        `/api/me/team-ranks${seasonId ? `?seasonId=${seasonId}` : ''}`,
      ),
  });

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiFetch<Notification[]>('/api/me/notifications'),
  });
