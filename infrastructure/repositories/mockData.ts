import type { Zone } from '@/domain/entities/Zone';

export const mockZones: Zone[] = [
  {
    id: 'z1',
    name: 'Salagua',
    municipality: 'Manzanillo',
    center: [-104.35, 19.122],
    modules: [
      {
        moduleId: 'demografia',
        moduleName: 'Demografía',
        moduleWeight: 0.35,
        indicators: [
          { id: 'poblacion_objetivo', name: 'Población objetivo', value: 42000, min: 18000, max: 50000, weight: 0.4, direction: 'positive' },
          { id: 'ingreso_medio', name: 'Ingreso medio', value: 16800, min: 9000, max: 25000, weight: 0.35, direction: 'positive' },
          { id: 'cobertura_asegurada', name: 'Cobertura asegurada', value: 62, min: 35, max: 90, weight: 0.25, direction: 'positive' },
        ],
      },
      {
        moduleId: 'competencia',
        moduleName: 'Competencia',
        moduleWeight: 0.25,
        indicators: [
          { id: 'hospitales_10km', name: 'Hospitales a 10km', value: 5, min: 0, max: 7, weight: 0.45, direction: 'negative' },
          { id: 'ocupacion_hospitalaria', name: 'Ocupación hospitalaria', value: 89, min: 50, max: 95, weight: 0.3, direction: 'positive' },
          { id: 'camas_disponibles', name: 'Camas disponibles', value: 190, min: 80, max: 420, weight: 0.25, direction: 'negative' },
        ],
      },
      {
        moduleId: 'economia',
        moduleName: 'Economía local',
        moduleWeight: 0.4,
        indicators: [
          { id: 'crecimiento_pib_local', name: 'Crecimiento PIB local', value: 3.1, min: 1, max: 5, weight: 0.3, direction: 'positive' },
          { id: 'costo_suelo', name: 'Costo suelo', value: 4200, min: 1800, max: 7500, weight: 0.4, direction: 'negative' },
          { id: 'indice_formalidad', name: 'Índice formalidad', value: 58, min: 30, max: 85, weight: 0.3, direction: 'positive' },
        ],
      },
    ],
  },
  {
    id: 'z2',
    name: 'Santiago',
    municipality: 'Manzanillo',
    center: [-104.37, 19.1],
    modules: [
      {
        moduleId: 'demografia',
        moduleName: 'Demografía',
        moduleWeight: 0.35,
        indicators: [
          { id: 'poblacion_objetivo', name: 'Población objetivo', value: 36500, min: 18000, max: 50000, weight: 0.4, direction: 'positive' },
          { id: 'ingreso_medio', name: 'Ingreso medio', value: 14900, min: 9000, max: 25000, weight: 0.35, direction: 'positive' },
          { id: 'cobertura_asegurada', name: 'Cobertura asegurada', value: 53, min: 35, max: 90, weight: 0.25, direction: 'positive' },
        ],
      },
      {
        moduleId: 'competencia',
        moduleName: 'Competencia',
        moduleWeight: 0.25,
        indicators: [
          { id: 'hospitales_10km', name: 'Hospitales a 10km', value: 2, min: 0, max: 7, weight: 0.45, direction: 'negative' },
          { id: 'ocupacion_hospitalaria', name: 'Ocupación hospitalaria', value: 81, min: 50, max: 95, weight: 0.3, direction: 'positive' },
          { id: 'camas_disponibles', name: 'Camas disponibles', value: 140, min: 80, max: 420, weight: 0.25, direction: 'negative' },
        ],
      },
      {
        moduleId: 'economia',
        moduleName: 'Economía local',
        moduleWeight: 0.4,
        indicators: [
          { id: 'crecimiento_pib_local', name: 'Crecimiento PIB local', value: 3.9, min: 1, max: 5, weight: 0.3, direction: 'positive' },
          { id: 'costo_suelo', name: 'Costo suelo', value: 3700, min: 1800, max: 7500, weight: 0.4, direction: 'negative' },
          { id: 'indice_formalidad', name: 'Índice formalidad', value: 64, min: 30, max: 85, weight: 0.3, direction: 'positive' },
        ],
      },
    ],
  },
  {
    id: 'z3',
    name: 'Centro',
    municipality: 'Manzanillo',
    center: [-104.322, 19.058],
    modules: [
      {
        moduleId: 'demografia',
        moduleName: 'Demografía',
        moduleWeight: 0.35,
        indicators: [
          { id: 'poblacion_objetivo', name: 'Población objetivo', value: 28900, min: 18000, max: 50000, weight: 0.4, direction: 'positive' },
          { id: 'ingreso_medio', name: 'Ingreso medio', value: 13100, min: 9000, max: 25000, weight: 0.35, direction: 'positive' },
          { id: 'cobertura_asegurada', name: 'Cobertura asegurada', value: 49, min: 35, max: 90, weight: 0.25, direction: 'positive' },
        ],
      },
      {
        moduleId: 'competencia',
        moduleName: 'Competencia',
        moduleWeight: 0.25,
        indicators: [
          { id: 'hospitales_10km', name: 'Hospitales a 10km', value: 6, min: 0, max: 7, weight: 0.45, direction: 'negative' },
          { id: 'ocupacion_hospitalaria', name: 'Ocupación hospitalaria', value: 75, min: 50, max: 95, weight: 0.3, direction: 'positive' },
          { id: 'camas_disponibles', name: 'Camas disponibles', value: 310, min: 80, max: 420, weight: 0.25, direction: 'negative' },
        ],
      },
      {
        moduleId: 'economia',
        moduleName: 'Economía local',
        moduleWeight: 0.4,
        indicators: [
          { id: 'crecimiento_pib_local', name: 'Crecimiento PIB local', value: 2.4, min: 1, max: 5, weight: 0.3, direction: 'positive' },
          { id: 'costo_suelo', name: 'Costo suelo', value: 6100, min: 1800, max: 7500, weight: 0.4, direction: 'negative' },
          { id: 'indice_formalidad', name: 'Índice formalidad', value: 55, min: 30, max: 85, weight: 0.3, direction: 'positive' },
        ],
      },
    ],
  },
];
