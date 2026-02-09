import type { GeoRepository } from '@/domain/ports/GeoRepository';
import type { IndicatorRepository } from '@/domain/ports/IndicatorRepository';
import { LocationAnalysisService } from '@/domain/services/LocationAnalysisService';
import { ScoringService } from '@/domain/services/ScoringService';

export class AnalyzeZone {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly geoRepository: GeoRepository,
    private readonly analysisService = new LocationAnalysisService(new ScoringService())
  ) {}

  async execute(zoneId: string) {
    const zone = await this.indicatorRepository.getZoneById(zoneId);
    if (!zone) return null;

    const [score, buffers] = await Promise.all([
      Promise.resolve(this.analysisService.analyzeZone(zone)),
      this.geoRepository.getBuffersGeoJSON(zoneId),
    ]);

    return { zone, score, buffers };
  }
}
