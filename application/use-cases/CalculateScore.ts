import type { IndicatorRepository } from '@/domain/ports/IndicatorRepository';
import type { ZoneScoreResult } from '@/domain/ports/ScoringPort';
import { ScoringService } from '@/domain/services/ScoringService';

export class CalculateScore {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly scoringService = new ScoringService()
  ) {}

  async execute(zoneId: string): Promise<ZoneScoreResult | null> {
    const zone = await this.indicatorRepository.getZoneById(zoneId);
    if (!zone) return null;
    return this.scoringService.calculateZoneScore(zone);
  }
}
