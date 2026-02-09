'use client';

import { useDashboardStore } from '@/store/dashboardStore';

export function LayerPanel() {
  const layers = useDashboardStore((state) => state.layers);
  const toggleLayerVisibility = useDashboardStore((state) => state.toggleLayerVisibility);
  const setLayerOpacity = useDashboardStore((state) => state.setLayerOpacity);

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Capas del mapa</h3>
      <div className="space-y-3">
        {layers.map((layer) => (
          <div key={layer.id} className="rounded-lg border border-slate-200 p-3">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{layer.name}</span>
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => toggleLayerVisibility(layer.id)}
                className="h-4 w-4"
              />
            </label>
            <div className="mt-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={layer.opacity}
                onChange={(event) => setLayerOpacity(layer.id, Number(event.target.value))}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
