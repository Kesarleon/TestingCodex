import type { Zone } from '../entities/Zone';

export interface ModuleScore {
  moduleId: string;
  moduleName: string;
  score: number;
}

export interface ZoneScoreResult {
  zoneId: string;
  zoneName: string;
  totalScore: number;
  classification: 'Excelente' | 'Alta' | 'Media' | 'Riesgosa';
  moduleScores: ModuleScore[];
}

export interface ScoringPort {
  calculateZoneScore(zone: Zone): ZoneScoreResult;
}
