# Prototipo de app: Location Intelligence

Este repositorio contiene un prototipo de Location Intelligence con dos capas:

1. **Pipeline analítico** (datos simulados → wrangling → modelado → tablas finales).
2. **Frontend modular** que consume tablas finales para rankear zonas candidatas.

## Caso de ejemplo

El pipeline está parametrizado para un caso de negocio específico: **decidir la mejor zona de Manzanillo, Colima para abrir un hospital**.

## Pipeline de datos

El pipeline vive en `pipeline/run_pipeline.py` y ejecuta estas etapas:

- **Carga de datos simulados** geográficos, demográficos, de salud y mercado (`data/raw_simulated/*.csv`).
- **Data wrangling**: casteo de tipos, imputación por mediana y construcción de feature store (`data/intermediate/feature_store.csv`).
- **Modelado**: entrenamiento de un modelo lineal simple sobre ROI sintético histórico para estimar rentabilidad por zona.
- **Tablas finales** para backend/frontend (`data/final/*.csv` y `data/final/frontend_payload.json`).
- **Exportación al frontend**: genera automáticamente `src/modules/moduleCatalog.js` y `src/modules/zoneData.js`.

### Ejecutar pipeline

```bash
python3 pipeline/run_pipeline.py
```

## Frontend modular

La app está diseñada por módulos para activar/desactivar capas de información:

- Demografía objetivo
- Movilidad y acceso
- Demanda de salud
- Competencia hospitalaria
- Riesgo territorial
- Costo operativo

## Estructura principal

- `pipeline/run_pipeline.py`: pipeline end-to-end.
- `data/raw_simulated/`: fuentes simuladas.
- `data/intermediate/`: tablas intermedias para validación.
- `data/final/`: tablas finales que alimentan la aplicación.
- `src/modules/moduleCatalog.js`: catálogo de módulos (generado por pipeline).
- `src/modules/zoneData.js`: zonas y factores por módulo (generado por pipeline).
- `src/modules/scoringEngine.js`: lógica de score interactivo en frontend.
- `src/app.js`: render y conexión de UI.

## Ejecutar frontend

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Luego abre `http://localhost:4173`.
