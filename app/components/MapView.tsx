'use client';

import { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { GeoJSONSourceRaw } from 'mapbox-gl';
import { MapboxAdapter } from '@/infrastructure/mapbox/MapboxAdapter';
import { useDashboardStore } from '@/store/dashboardStore';
import type { FeatureCollection } from 'geojson';

interface MapViewProps {
  zonesGeoJSON: FeatureCollection;
  buffersGeoJSON: FeatureCollection;
}

export function MapView({ zonesGeoJSON, buffersGeoJSON }: MapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const adapterRef = useRef<MapboxAdapter | null>(null);
  const layers = useDashboardStore((state) => state.layers);
  const setSelectedZoneId = useDashboardStore((state) => state.setSelectedZoneId);

  useEffect(() => {
    if (!ref.current || adapterRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
    const adapter = new MapboxAdapter(ref.current, token, [-104.34, 19.09], 11.1);
    adapterRef.current = adapter;

    adapter.onLoad(() => {
      adapter.addLayer({
        id: 'zones-fill',
        name: 'Zonas',
        source: { type: 'geojson', data: zonesGeoJSON } as GeoJSONSourceRaw,
        mapboxLayer: {
          id: 'zones-fill',
          type: 'fill',
          source: 'zones-fill',
          paint: {
            'fill-color': '#2563eb',
            'fill-outline-color': '#0f172a',
            'fill-opacity': 0.55,
          },
        },
        visible: true,
        opacity: 0.55,
      });

      adapter.addLayer({
        id: 'buffers-layer',
        name: 'Buffers',
        source: { type: 'geojson', data: buffersGeoJSON } as GeoJSONSourceRaw,
        mapboxLayer: {
          id: 'buffers-layer',
          type: 'fill',
          source: 'buffers-layer',
          paint: {
            'fill-color': [
              'match',
              ['get', 'minutes'],
              5,
              '#16a34a',
              10,
              '#f59e0b',
              '#ef4444',
            ],
            'fill-opacity': 0.3,
          },
        },
        visible: true,
        opacity: 0.3,
      });

      adapter.onZoneClick('zones-fill', (zoneId) => setSelectedZoneId(zoneId));
    });

    return () => {
      adapter.destroy();
      adapterRef.current = null;
    };
  }, [zonesGeoJSON, buffersGeoJSON, setSelectedZoneId]);

  useEffect(() => {
    if (!adapterRef.current) return;
    layers.forEach((layer) => {
      adapterRef.current?.setLayerVisibility(layer.id, layer.visible);
      adapterRef.current?.setLayerOpacity(layer.id, layer.opacity);
    });
  }, [layers]);

  useEffect(() => {
    adapterRef.current?.updateGeoJsonSource('buffers-layer', buffersGeoJSON);
  }, [buffersGeoJSON]);

  return <div ref={ref} className="h-[520px] w-full rounded-xl border border-slate-300" />;
}
