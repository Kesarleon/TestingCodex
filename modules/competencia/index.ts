export const moduleConfig = {
  id: 'competencia',
  name: 'Competencia',
  indicators: ['hospitales_10km', 'ocupacion_hospitalaria', 'camas_disponibles'],
  layers: ['competitors-points'],
  weight: 0.25,
} as const;
