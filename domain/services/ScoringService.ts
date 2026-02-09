import type { Indicator } from '../entities/Indicator';
import type { Zone } from '../entities/Zone';
import type { ScoringPort, ZoneScoreResult } from '../ports/ScoringPort';

export class ScoringService implements ScoringPort {
  private normalize(indicator: Indicator): number {
    if (indicator.max === indicator.min) {
      return 0;
    }

    const base = (indicator.value - indicator.min) / (indicator.max - indicator.min);
    const normalized = indicator.direction === 'positive' ? base : 1 - base;

    return Math.max(0, Math.min(1, normalized));
  }

  private classify(score0to100: number): ZoneScoreResult['classification'] {
    if (score0to100 >= 80) return 'Excelente';
    if (score0to100 >= 60) return 'Alta';
    if (score0to100 >= 40) return 'Media';
    return 'Riesgosa';
  }

  calculateZoneScore(zone: Zone): ZoneScoreResult {
    const moduleScores = zone.modules.map((module) => {
      const score = module.indicators.reduce((acc, indicator) => {
        const normalized = this.normalize(indicator);
        return acc + normalized * indicator.weight;
      }, 0);

      return {
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        score,
      };
    });

    const total0to1 = moduleScores.reduce((acc, moduleScore) => {
      const zoneModule = zone.modules.find((m) => m.moduleId === moduleScore.moduleId);
      const moduleWeight = zoneModule?.moduleWeight ?? 0;
      return acc + moduleScore.score * moduleWeight;
    }, 0);

    const totalScore = Math.round(total0to1 * 10000) / 100;

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      totalScore,
      classification: this.classify(totalScore),
      moduleScores: moduleScores.map((m) => ({ ...m, score: Math.round(m.score * 10000) / 100 })),
    };
  }
}
