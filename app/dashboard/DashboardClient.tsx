'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnalyzeZone } from '@/application/use-cases/AnalyzeZone';
import { CompareLocations } from '@/application/use-cases/CompareLocations';
import { MockGeoRepository } from '@/infrastructure/repositories/MockGeoRepository';
import { MockIndicatorRepository } from '@/infrastructure/repositories/MockIndicatorRepository';
import { useDashboardStore } from '@/store/dashboardStore';
import { MapView } from '@/app/components/MapView';
import { LayerPanel } from '@/app/components/LayerPanel';
import { AnalysisPanel } from '@/app/components/AnalysisPanel';
import { LocationComparator } from '@/app/components/LocationComparator';
import type { FeatureCollection } from 'geojson';
import type { Zone } from '@/domain/entities/Zone';
import type { ZoneScoreResult } from '@/domain/ports/ScoringPort';

const indicatorRepo = new MockIndicatorRepository();
const geoRepo = new MockGeoRepository();
const analyzeZone = new AnalyzeZone(indicatorRepo, geoRepo);
const compareLocations = new CompareLocations(indicatorRepo);

const emptyFeatureCollection: FeatureCollection = { type: 'FeatureCollection', features: [] };

export default function DashboardClient() {
  const selectedZoneId = useDashboardStore((state) => state.selectedZoneId);
  const comparisonZoneIds = useDashboardStore((state) => state.comparisonZoneIds);

  const [zones, setZones] = useState<Zone[]>([]);
  const [zonesGeoJSON, setZonesGeoJSON] = useState<FeatureCollection>(emptyFeatureCollection);
  const [buffersGeoJSON, setBuffersGeoJSON] = useState<FeatureCollection>(emptyFeatureCollection);
  const [analysisResult, setAnalysisResult] = useState<ZoneScoreResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ZoneScoreResult[]>([]);

  useEffect(() => {
    void (async () => {
      const [zoneList, zonePolygons] = await Promise.all([
        indicatorRepo.getZones(),
        geoRepo.getZonesGeoJSON(),
      ]);
      setZones(zoneList);
      setZonesGeoJSON(zonePolygons);
    })();
  }, []);

  useEffect(() => {
    if (!selectedZoneId) return;

    void (async () => {
      const data = await analyzeZone.execute(selectedZoneId);
      if (!data) return;
      setAnalysisResult(data.score);
      setBuffersGeoJSON(data.buffers);
    })();
  }, [selectedZoneId]);

  useEffect(() => {
    void (async () => {
      const data = await compareLocations.execute(comparisonZoneIds);
      setComparisonResult(data);
    })();
  }, [comparisonZoneIds]);

  const hasMapToken = useMemo(() => Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN), []);

  return (
    <main className="min-h-screen p-6">
      <header className="mb-5 rounded-xl border border-slate-300 bg-white p-4">
        <h1 className="text-xl font-bold">Location Intelligence Platform Core</h1>
        <p className="text-sm text-slate-600">
          Base funcional empresarial con arquitectura hexagonal para evaluar nuevas sucursales.
        </p>
      </header>

      {!hasMapToken && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          Configura <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> para visualizar el mapa de Mapbox.
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <MapView zonesGeoJSON={zonesGeoJSON} buffersGeoJSON={buffersGeoJSON} />
        <div className="space-y-4">
          <LayerPanel />
          <AnalysisPanel result={analysisResult} />
        </div>
      </section>

      <section className="mt-4">
        <LocationComparator zones={zones} comparison={comparisonResult} />
      </section>
    </main>
  );
}
