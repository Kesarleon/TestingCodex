import type { Feature, FeatureCollection } from 'geojson';
import type { GeoRepository } from '@/domain/ports/GeoRepository';
import zones from '@/public/data/zones.geojson';
import buffers from '@/public/data/buffers.geojson';

export class MockGeoRepository implements GeoRepository {
  async getZonesGeoJSON(): Promise<FeatureCollection> {
    return zones as FeatureCollection;
  }

  async getBuffersGeoJSON(zoneId: string): Promise<FeatureCollection> {
    const features = (buffers as FeatureCollection).features.filter(
      (feature) => feature.properties?.zoneId === zoneId
    ) as Feature[];

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
