import type { Zone } from '../entities/Zone';

export interface IndicatorRepository {
  getZones(): Promise<Zone[]>;
  getZoneById(zoneId: string): Promise<Zone | null>;
}
