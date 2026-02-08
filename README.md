# Prototipo de app: Location Intelligence

Este repositorio contiene un prototipo inicial de una app para priorizar zonas y decidir dónde abrir la siguiente sucursal.

## Enfoque modular

La app está diseñada por módulos para poder activar o desactivar capas de información según industria:

- Demografía y poder adquisitivo
- Movilidad y accesibilidad
- Competencia y saturación
- Riesgo urbano
- Demanda digital

Cada módulo tiene un peso configurable y el motor de scoring recalcula en tiempo real el ranking de zonas candidatas.

## Estructura

- `src/modules/moduleCatalog.js`: catálogo de módulos y pesos.
- `src/modules/zoneData.js`: datos mock de zonas.
- `src/modules/scoringEngine.js`: lógica de cálculo del score.
- `src/app.js`: render y conexión de UI con el motor.

## Ejecutar localmente

Puedes levantar un servidor estático simple:

```bash
python3 -m http.server 4173
```

Luego abre `http://localhost:4173`.
