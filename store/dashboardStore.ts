import { create } from 'zustand';

interface LayerState {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
}

interface DashboardState {
  selectedZoneId: string | null;
  comparisonZoneIds: string[];
  layers: LayerState[];
  setSelectedZoneId: (zoneId: string | null) => void;
  toggleComparisonZone: (zoneId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  selectedZoneId: 'z1',
  comparisonZoneIds: ['z1'],
  layers: [
    { id: 'zones-fill', name: 'Zonas objetivo', visible: true, opacity: 0.55 },
    { id: 'buffers-layer', name: 'Buffers (5/10/15 min)', visible: true, opacity: 0.3 },
  ],
  setSelectedZoneId: (zoneId) => set({ selectedZoneId: zoneId }),
  toggleComparisonZone: (zoneId) => {
    const current = get().comparisonZoneIds;
    const exists = current.includes(zoneId);

    if (exists) {
      set({ comparisonZoneIds: current.filter((id) => id !== zoneId) });
      return;
    }

    if (current.length >= 3) return;
    set({ comparisonZoneIds: [...current, zoneId] });
  },
  toggleLayerVisibility: (layerId) =>
    set({
      layers: get().layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    }),
  setLayerOpacity: (layerId, opacity) =>
    set({
      layers: get().layers.map((layer) => (layer.id === layerId ? { ...layer, opacity } : layer)),
    }),
}));
