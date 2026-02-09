import type { IndicatorRepository } from '@/domain/ports/IndicatorRepository';
import { LocationAnalysisService } from '@/domain/services/LocationAnalysisService';
import { ScoringService } from '@/domain/services/ScoringService';

export class CompareLocations {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly analysisService = new LocationAnalysisService(new ScoringService())
  ) {}

  async execute(zoneIds: string[]) {
    const zones = await Promise.all(zoneIds.map((zoneId) => this.indicatorRepository.getZoneById(zoneId)));
    const validZones = zones.filter((zone): zone is NonNullable<typeof zone> => Boolean(zone));
    return this.analysisService.compareZones(validZones);
  }
}
