'use client';

import type { Zone } from '@/domain/entities/Zone';
import type { ZoneScoreResult } from '@/domain/ports/ScoringPort';
import { useDashboardStore } from '@/store/dashboardStore';

interface LocationComparatorProps {
  zones: Zone[];
  comparison: ZoneScoreResult[];
}

export function LocationComparator({ zones, comparison }: LocationComparatorProps) {
  const selected = useDashboardStore((state) => state.comparisonZoneIds);
  const toggle = useDashboardStore((state) => state.toggleComparisonZone);
  const best = comparison[0]?.zoneId;

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4">
      <h3 className="mb-3 text-base font-semibold">Comparador (hasta 3 ubicaciones)</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {zones.map((zone) => {
          const active = selected.includes(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => toggle(zone.id)}
              className={`rounded-full border px-3 py-1 text-sm ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300'}`}
            >
              {zone.name}
            </button>
          );
        })}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="pb-2">Zona</th>
            <th className="pb-2">Score</th>
            <th className="pb-2">Clasificación</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((row) => (
            <tr key={row.zoneId} className={`border-b border-slate-100 ${row.zoneId === best ? 'bg-emerald-50' : ''}`}>
              <td className="py-2 font-medium">{row.zoneName}</td>
              <td className="py-2">{row.totalScore}</td>
              <td className="py-2">{row.classification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
