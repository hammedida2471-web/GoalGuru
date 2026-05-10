export type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  competition: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  venue: string;
}

export interface Prediction {
  matchId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  winProbability: {
    home: number;
    draw: number;
    away: number;
  };
  analysis: string;
  keyFactors: string[];
  confidence: number;
  goalRange?: string;
  goalExpectancy?: number;
  matchDetails?: {
    venue: string;
    referee: string;
    homeStats?: {
      lastFive: string;
      topScorer: string;
      avgGoals: number;
    };
    awayStats?: {
      lastFive: string;
      topScorer: string;
      avgGoals: number;
    };
  };
}
