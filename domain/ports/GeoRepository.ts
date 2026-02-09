import type { FeatureCollection } from 'geojson';

export interface GeoRepository {
  getZonesGeoJSON(): Promise<FeatureCollection>;
  getBuffersGeoJSON(zoneId: string): Promise<FeatureCollection>;
}
