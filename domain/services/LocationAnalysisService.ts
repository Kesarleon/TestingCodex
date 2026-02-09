import type { Zone } from '../entities/Zone';
import type { ZoneScoreResult } from '../ports/ScoringPort';
import { ScoringService } from './ScoringService';

export class LocationAnalysisService {
  constructor(private readonly scoringService: ScoringService) {}

  analyzeZone(zone: Zone): ZoneScoreResult {
    return this.scoringService.calculateZoneScore(zone);
  }

  compareZones(zones: Zone[]): ZoneScoreResult[] {
    return zones
      .map((zone) => this.scoringService.calculateZoneScore(zone))
      .sort((a, b) => b.totalScore - a.totalScore);
  }
}
