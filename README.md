# Location Intelligence SaaS Starter (Hexagonal + Next.js)

Base funcional de una plataforma de Location Intelligence empresarial para evaluar ubicaciones de nuevas sucursales con scoring multi-criterio geoespacial.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Mapbox GL JS
- Zustand
- Tailwind CSS
- Arquitectura Hexagonal (Ports & Adapters)
- Datos simulados: GeoJSON + JSON

## Arquitectura

```text
/domain
  /entities
  /services
  /ports
/application
  /use-cases
/infrastructure
  /mapbox
  /repositories
/modules
  /demografia
  /competencia
  economia.ts
/app
  /dashboard
  /components
```

### Principios aplicados

- **Dominio puro**: scoring y lógica de negocio desacoplados de UI y Mapbox.
- **Casos de uso**: `AnalyzeZone`, `CompareLocations`, `CalculateScore` orquestan dominio + puertos.
- **Adapters**: repositorios mock y adapter de Mapbox intercambiables por implementaciones productivas.
- **Módulos plug-in**: cada módulo analítico exporta su propia configuración y peso.

## Modelo de scoring (implementado en dominio)

1. Normalización Min–Max por indicador (dirección positiva/negativa).
2. Score por módulo = sum(normalized * indicator.weight).
3. Score total = sum(moduleScore * module.weight).
4. Normalización final 0–100.
5. Clasificación:
   - 80–100: Excelente
   - 60–79: Alta
   - 40–59: Media
   - < 40: Riesgosa

## Dataset demo

Caso: ubicación de hospital en Manzanillo, Colima.

- `public/data/zones.geojson`: polígonos de zonas.
- `public/data/buffers.geojson`: buffers mock 5, 10 y 15 min por zona.
- `infrastructure/repositories/mockData.ts`: indicadores simulados por zona y módulo.

## Ejecutar

```bash
npm install
npm run dev
```

Configura token de mapbox en `.env.local`:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token
```

## Escalamiento a producción

- Sustituir `MockIndicatorRepository` por adapters a PostGIS/BigQuery.
- Sustituir `MockGeoRepository` por vector tiles / servicios geoespaciales.
- Versionar módulos por industria y habilitar feature flags por tenant.
- Persistir escenarios y auditoría de decisiones para trazabilidad empresarial.
