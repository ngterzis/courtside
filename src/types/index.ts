export type PlayerId = string;
export type GameId = string;
export type SeasonId = string;

export type Position = 'Guard' | 'Forward' | 'Center';

export interface Player {
  id: PlayerId;
  name: string;
  jerseyNumber: number;
  position: Position;
  teamId: string;
  onboardedAt: string | null;
}

export interface Season {
  id: SeasonId;
  label: string;
  startDate: string;
  endDate: string | null;
}

export interface GameStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
  ftMade: number;
  ftAttempted: number;
  fgPct?: number;
  threePct?: number;
  ftPct?: number;
  tsPct?: number;
}

export interface CoachNote {
  id: string;
  gameId: GameId;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Game {
  id: GameId;
  seasonId: SeasonId;
  date: string;
  opponent: string;
  homeAway: 'H' | 'A';
  result: 'W' | 'L';
  teamScore: number;
  opponentScore: number;
  stats: GameStats;
  personalBests: Array<keyof GameStats>;
  coachNote?: CoachNote;
}

export interface SeasonAverages extends GameStats {
  gamesPlayed: number;
  seasonId: SeasonId;
}

export type ArchetypeName =
  | 'Playmaker'
  | 'Efficient Scorer'
  | 'Glass Cleaner'
  | 'Defensive Anchor'
  | '3&D Wing'
  | 'Rim Protector'
  | 'Spark Plug'
  | 'Floor General'
  | 'Hustle Player';

export interface ArchetypeReceiptLine {
  stat: string;
  value: string;
  percentile: number;
  comment: string;
}

export interface ArchetypeScore {
  name: string;
  score: number;
  isPrimary?: boolean;
  isSecondary?: boolean;
}

export interface Archetype {
  primary: ArchetypeName;
  secondary: ArchetypeName;
  explanation: string;
  receipt: ArchetypeReceiptLine[];
  scores?: ArchetypeScore[];
  assignedAt: string;
  seasonId: SeasonId;
}

export interface TeamRank {
  stat: keyof GameStats;
  percentile: number;
  label: string;
}

export interface TrendPoint {
  date: string;
  value: number;
  gameId?: GameId;
  opponent?: string;
}
