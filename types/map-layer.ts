import type { GeoJSONSourceRaw, Layer } from 'mapbox-gl';

export interface MapLayer {
  id: string;
  name: string;
  source: GeoJSONSourceRaw;
  mapboxLayer: Layer;
  visible: boolean;
  opacity: number;
}
