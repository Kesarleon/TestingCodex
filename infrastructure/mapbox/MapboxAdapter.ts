import mapboxgl from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';
import type { MapLayer } from '@/types/map-layer';

export class MapboxAdapter {
  private map: mapboxgl.Map;

  constructor(container: HTMLDivElement, accessToken: string, center: [number, number], zoom = 11) {
    mapboxgl.accessToken = accessToken;

    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom,
    });
  }

  onLoad(cb: () => void): void {
    this.map.on('load', cb);
  }

  addLayer(layer: MapLayer): void {
    this.map.addSource(layer.id, layer.source);
    this.map.addLayer(layer.mapboxLayer);
    this.setLayerVisibility(layer.id, layer.visible);
    this.setLayerOpacity(layer.id, layer.opacity);
  }

  updateGeoJsonSource(sourceId: string, data: FeatureCollection): void {
    const source = this.map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
    if (source) source.setData(data);
  }

  setLayerVisibility(layerId: string, visible: boolean): void {
    this.map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }

  setLayerOpacity(layerId: string, opacity: number): void {
    const type = this.map.getLayer(layerId)?.type;

    if (type === 'fill') {
      this.map.setPaintProperty(layerId, 'fill-opacity', opacity);
    }

    if (type === 'circle') {
      this.map.setPaintProperty(layerId, 'circle-opacity', opacity);
    }

    if (type === 'line') {
      this.map.setPaintProperty(layerId, 'line-opacity', opacity);
    }
  }

  onZoneClick(layerId: string, cb: (zoneId: string) => void): void {
    this.map.on('click', layerId, (event) => {
      const zoneId = event.features?.[0]?.properties?.id;
      if (zoneId) cb(zoneId);
    });

    this.map.on('mouseenter', layerId, () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', layerId, () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  destroy(): void {
    this.map.remove();
  }
}
