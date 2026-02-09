import type { IndicatorRepository } from '@/domain/ports/IndicatorRepository';
import type { Zone } from '@/domain/entities/Zone';
import { mockZones } from './mockData';

export class MockIndicatorRepository implements IndicatorRepository {
  async getZones(): Promise<Zone[]> {
    return mockZones;
  }

  async getZoneById(zoneId: string): Promise<Zone | null> {
    return mockZones.find((zone) => zone.id === zoneId) ?? null;
  }
}
