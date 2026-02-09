export const moduleConfig = {
  id: 'economia',
  name: 'Economía local',
  indicators: ['crecimiento_pib_local', 'costo_suelo', 'indice_formalidad'],
  layers: ['income-choropleth'],
  weight: 0.4,
} as const;
