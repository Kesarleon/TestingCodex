#!/usr/bin/env python3
"""Pipeline end-to-end para Location Intelligence (caso hospital en Manzanillo)."""

from __future__ import annotations

import csv
import json
import math
import random
from dataclasses import dataclass
from pathlib import Path
from statistics import mean, median

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw_simulated"
INTERMEDIATE_DIR = ROOT / "data" / "intermediate"
FINAL_DIR = ROOT / "data" / "final"
FRONTEND_MODULES_FILE = ROOT / "src" / "modules" / "moduleCatalog.js"
FRONTEND_ZONE_FILE = ROOT / "src" / "modules" / "zoneData.js"

SEED = 42


@dataclass(frozen=True)
class ZoneBase:
    zone_id: str
    name: str
    lat: float
    lon: float


MANZANILLO_ZONES = [
    ZoneBase("Z01", "Valle de las Garzas", 19.095, -104.312),
    ZoneBase("Z02", "Salagua", 19.125, -104.345),
    ZoneBase("Z03", "Santiago", 19.104, -104.365),
    ZoneBase("Z04", "Centro", 19.051, -104.318),
    ZoneBase("Z05", "Tapeixtles", 19.077, -104.335),
    ZoneBase("Z06", "El Colomo", 19.061, -104.251),
    ZoneBase("Z07", "Jalipa", 19.098, -104.286),
    ZoneBase("Z08", "Las Brisas", 19.114, -104.338),
]

MODULE_SPECS = [
    {
        "id": "demografia",
        "name": "Demografía objetivo",
        "description": "Población objetivo, densidad e ingreso disponible.",
        "weight": 0.2,
    },
    {
        "id": "movilidad",
        "name": "Movilidad y acceso",
        "description": "Conectividad vial, tiempos de traslado y flujo diario.",
        "weight": 0.17,
    },
    {
        "id": "salud",
        "name": "Demanda de salud",
        "description": "Incidencia crónica, urgencias y presión de atención médica.",
        "weight": 0.24,
    },
    {
        "id": "competencia",
        "name": "Competencia hospitalaria",
        "description": "Saturación de camas y cercanía de oferta existente.",
        "weight": 0.15,
    },
    {
        "id": "riesgo",
        "name": "Riesgo territorial",
        "description": "Seguridad, inundaciones y estabilidad de operación.",
        "weight": 0.12,
    },
    {
        "id": "costos",
        "name": "Costo operativo",
        "description": "Costo de suelo, renta y gasto logístico estimado.",
        "weight": 0.12,
    },
]


def ensure_directories() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    INTERMEDIATE_DIR.mkdir(parents=True, exist_ok=True)
    FINAL_DIR.mkdir(parents=True, exist_ok=True)


def write_csv(path: Path, rows: list[dict]) -> None:
    if not rows:
        raise ValueError(f"No se puede escribir CSV vacío: {path}")

    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def read_csv(path: Path) -> list[dict]:
    with path.open("r", newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def inject_missing(rows: list[dict], fields: list[str], ratio: float = 0.1) -> None:
    for row in rows:
        for field in fields:
            if random.random() < ratio:
                row[field] = ""


def generate_raw_data() -> None:
    random.seed(SEED)

    geographic_rows = []
    demographic_rows = []
    health_rows = []
    market_rows = []

    for zone in MANZANILLO_ZONES:
        geographic_rows.append(
            {
                "zone_id": zone.zone_id,
                "zone_name": zone.name,
                "lat": zone.lat,
                "lon": zone.lon,
                "distance_to_port_km": round(random.uniform(1.0, 16.0), 2),
                "avg_commute_min": round(random.uniform(12, 42), 1),
                "daily_vehicle_flow": random.randint(12000, 57000),
                "flood_risk_index": round(random.uniform(15, 92), 1),
                "safety_index": round(random.uniform(40, 90), 1),
            }
        )

        demographic_rows.append(
            {
                "zone_id": zone.zone_id,
                "population": random.randint(14000, 48000),
                "population_density": round(random.uniform(2200, 8100), 1),
                "median_income_mxn": round(random.uniform(9200, 28600), 0),
                "senior_share_pct": round(random.uniform(7.0, 21.0), 1),
                "insured_share_pct": round(random.uniform(34.0, 81.0), 1),
            }
        )

        health_rows.append(
            {
                "zone_id": zone.zone_id,
                "chronic_rate_pct": round(random.uniform(11.0, 30.0), 2),
                "emergency_incidents_month": random.randint(80, 450),
                "births_per_month": random.randint(18, 95),
                "elderly_dependency_ratio": round(random.uniform(6.0, 19.0), 1),
            }
        )

        market_rows.append(
            {
                "zone_id": zone.zone_id,
                "competitor_hospitals_5km": random.randint(0, 6),
                "available_beds_5km": random.randint(30, 520),
                "land_cost_m2_mxn": round(random.uniform(1700, 9500), 0),
                "avg_rent_m2_mxn": round(random.uniform(180, 620), 1),
                "medical_staff_supply_index": round(random.uniform(35, 93), 1),
            }
        )

    inject_missing(demographic_rows, ["median_income_mxn", "insured_share_pct"], ratio=0.12)
    inject_missing(health_rows, ["chronic_rate_pct"], ratio=0.08)
    inject_missing(market_rows, ["avg_rent_m2_mxn", "medical_staff_supply_index"], ratio=0.1)

    write_csv(RAW_DIR / "geographic_data.csv", geographic_rows)
    write_csv(RAW_DIR / "demographic_data.csv", demographic_rows)
    write_csv(RAW_DIR / "health_data.csv", health_rows)
    write_csv(RAW_DIR / "market_data.csv", market_rows)


def cast_numeric(rows: list[dict], numeric_fields: list[str]) -> list[dict]:
    parsed = []
    for row in rows:
        converted = dict(row)
        for field in numeric_fields:
            value = converted.get(field, "")
            converted[field] = float(value) if value not in ("", None) else None
        parsed.append(converted)
    return parsed


def impute_median(rows: list[dict], fields: list[str]) -> None:
    for field in fields:
        available = [row[field] for row in rows if row[field] is not None]
        med = median(available)
        for row in rows:
            if row[field] is None:
                row[field] = med


def min_max_scale(values: list[float], invert: bool = False) -> list[float]:
    min_value = min(values)
    max_value = max(values)
    span = max_value - min_value
    if span == 0:
        scaled = [50.0 for _ in values]
    else:
        scaled = [((value - min_value) / span) * 100 for value in values]
    if invert:
        return [100 - value for value in scaled]
    return scaled


def build_feature_store() -> list[dict]:
    geo_rows = cast_numeric(
        read_csv(RAW_DIR / "geographic_data.csv"),
        [
            "lat",
            "lon",
            "distance_to_port_km",
            "avg_commute_min",
            "daily_vehicle_flow",
            "flood_risk_index",
            "safety_index",
        ],
    )
    demographic_rows = cast_numeric(
        read_csv(RAW_DIR / "demographic_data.csv"),
        [
            "population",
            "population_density",
            "median_income_mxn",
            "senior_share_pct",
            "insured_share_pct",
        ],
    )
    health_rows = cast_numeric(
        read_csv(RAW_DIR / "health_data.csv"),
        [
            "chronic_rate_pct",
            "emergency_incidents_month",
            "births_per_month",
            "elderly_dependency_ratio",
        ],
    )
    market_rows = cast_numeric(
        read_csv(RAW_DIR / "market_data.csv"),
        [
            "competitor_hospitals_5km",
            "available_beds_5km",
            "land_cost_m2_mxn",
            "avg_rent_m2_mxn",
            "medical_staff_supply_index",
        ],
    )

    impute_median(demographic_rows, ["median_income_mxn", "insured_share_pct"])
    impute_median(health_rows, ["chronic_rate_pct"])
    impute_median(market_rows, ["avg_rent_m2_mxn", "medical_staff_supply_index"])

    demographics_by_zone = {row["zone_id"]: row for row in demographic_rows}
    health_by_zone = {row["zone_id"]: row for row in health_rows}
    market_by_zone = {row["zone_id"]: row for row in market_rows}

    feature_rows = []
    for geo in geo_rows:
        zone_id = geo["zone_id"]
        row = {
            "zone_id": zone_id,
            "zone_name": geo["zone_name"],
            **geo,
            **demographics_by_zone[zone_id],
            **health_by_zone[zone_id],
            **market_by_zone[zone_id],
        }
        feature_rows.append(row)

    commute_scores = min_max_scale([row["avg_commute_min"] for row in feature_rows], invert=True)
    vehicle_scores = min_max_scale([row["daily_vehicle_flow"] for row in feature_rows])
    safety_scores = min_max_scale([row["safety_index"] for row in feature_rows])
    flood_scores = min_max_scale([row["flood_risk_index"] for row in feature_rows], invert=True)
    pop_scores = min_max_scale([row["population"] for row in feature_rows])
    income_scores = min_max_scale([row["median_income_mxn"] for row in feature_rows])
    health_demand_scores = min_max_scale(
        [
            row["chronic_rate_pct"] * 0.4
            + row["emergency_incidents_month"] * 0.4
            + row["births_per_month"] * 0.2
            for row in feature_rows
        ]
    )
    competition_scores = min_max_scale(
        [
            row["competitor_hospitals_5km"] * 0.55
            + row["available_beds_5km"] * 0.45
            for row in feature_rows
        ],
        invert=True,
    )
    cost_scores = min_max_scale(
        [row["land_cost_m2_mxn"] * 0.5 + row["avg_rent_m2_mxn"] * 0.5 for row in feature_rows],
        invert=True,
    )

    for idx, row in enumerate(feature_rows):
        row["demografia_score"] = round(pop_scores[idx] * 0.5 + income_scores[idx] * 0.35 + row["insured_share_pct"] * 0.15, 2)
        row["movilidad_score"] = round(commute_scores[idx] * 0.45 + vehicle_scores[idx] * 0.35 + safety_scores[idx] * 0.2, 2)
        row["salud_score"] = round(health_demand_scores[idx], 2)
        row["competencia_score"] = round(competition_scores[idx], 2)
        row["riesgo_score"] = round((safety_scores[idx] * 0.5 + flood_scores[idx] * 0.5), 2)
        row["costos_score"] = round(cost_scores[idx], 2)

    write_csv(INTERMEDIATE_DIR / "feature_store.csv", feature_rows)
    return feature_rows


def train_profitability_model(rows: list[dict]) -> list[dict]:
    random.seed(SEED)

    module_keys = [
        "demografia_score",
        "movilidad_score",
        "salud_score",
        "competencia_score",
        "riesgo_score",
        "costos_score",
    ]

    true_weights = [0.16, 0.14, 0.32, 0.16, 0.12, 0.10]
    historical_rows = []

    for row in rows:
        predictors = [row[key] for key in module_keys]
        synthetic_roi = sum(weight * predictor for weight, predictor in zip(true_weights, predictors))
        synthetic_roi += random.uniform(-6, 6)
        synthetic_roi = max(2, min(98, synthetic_roi))
        historical_rows.append({
            "zone_id": row["zone_id"],
            "zone_name": row["zone_name"],
            **{key: row[key] for key in module_keys},
            "observed_roi": round(synthetic_roi, 2),
        })

    write_csv(INTERMEDIATE_DIR / "historical_training_data.csv", historical_rows)

    y_mean = mean(item["observed_roi"] for item in historical_rows)
    x_means = {key: mean(item[key] for item in historical_rows) for key in module_keys}

    covariances = []
    variances = []
    for key in module_keys:
        cov = sum((item[key] - x_means[key]) * (item["observed_roi"] - y_mean) for item in historical_rows)
        var = sum((item[key] - x_means[key]) ** 2 for item in historical_rows)
        covariances.append(cov)
        variances.append(var)

    learned_weights = [cov / var if var else 0 for cov, var in zip(covariances, variances)]
    intercept = y_mean - sum(learned_weights[idx] * x_means[key] for idx, key in enumerate(module_keys))

    scored_rows = []
    for row in rows:
        predicted_roi = intercept + sum(
            learned_weights[idx] * row[key] for idx, key in enumerate(module_keys)
        )
        predicted_roi = max(0, min(100, predicted_roi))

        score = (
            row["demografia_score"] * 0.2
            + row["movilidad_score"] * 0.17
            + row["salud_score"] * 0.24
            + row["competencia_score"] * 0.15
            + row["riesgo_score"] * 0.12
            + row["costos_score"] * 0.12
        )

        scored_rows.append(
            {
                "zone_id": row["zone_id"],
                "zone_name": row["zone_name"],
                "lat": row["lat"],
                "lon": row["lon"],
                "demografia_score": round(row["demografia_score"], 2),
                "movilidad_score": round(row["movilidad_score"], 2),
                "salud_score": round(row["salud_score"], 2),
                "competencia_score": round(row["competencia_score"], 2),
                "riesgo_score": round(row["riesgo_score"], 2),
                "costos_score": round(row["costos_score"], 2),
                "location_score": round(score, 2),
                "predicted_roi": round(predicted_roi, 2),
            }
        )

    scored_rows.sort(key=lambda item: (item["predicted_roi"], item["location_score"]), reverse=True)
    for idx, row in enumerate(scored_rows, start=1):
        row["rank"] = idx

    write_csv(FINAL_DIR / "zone_profitability_scores.csv", scored_rows)
    write_csv(FINAL_DIR / "frontend_zones_table.csv", scored_rows)

    model_metadata = {
        "target": "predicted_roi",
        "intercept": round(intercept, 6),
        "features": {
            key: round(learned_weights[idx], 6) for idx, key in enumerate(module_keys)
        },
    }
    (FINAL_DIR / "model_metadata.json").write_text(
        json.dumps(model_metadata, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    return scored_rows


def export_frontend_inputs(scored_rows: list[dict]) -> None:
    frontend_payload = [
        {
            "name": row["zone_name"],
            "factors": {
                "demografia": round(row["demografia_score"]),
                "movilidad": round(row["movilidad_score"]),
                "salud": round(row["salud_score"]),
                "competencia": round(row["competencia_score"]),
                "riesgo": round(row["riesgo_score"]),
                "costos": round(row["costos_score"]),
            },
            "predictedRoi": row["predicted_roi"],
        }
        for row in scored_rows
    ]

    frontend_json = {
        "generated_for": "Hospital privado en Manzanillo, Colima",
        "modules": MODULE_SPECS,
        "zones": frontend_payload,
    }

    (FINAL_DIR / "frontend_payload.json").write_text(
        json.dumps(frontend_json, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    module_lines = ["export const modules = ["]
    for module in MODULE_SPECS:
        module_lines.extend(
            [
                "  {",
                f'    id: "{module["id"]}",',
                f'    name: "{module["name"]}",',
                f'    description: "{module["description"]}",',
                f'    weight: {module["weight"]},',
                "  },",
            ]
        )
    module_lines.append("];")
    FRONTEND_MODULES_FILE.write_text("\n".join(module_lines) + "\n", encoding="utf-8")

    zone_lines = ["export const zones = ["]
    for zone in frontend_payload:
        factors = zone["factors"]
        zone_lines.extend(
            [
                "  {",
                f'    name: "{zone["name"]}",',
                "    factors: {",
                f'      demografia: {factors["demografia"]},',
                f'      movilidad: {factors["movilidad"]},',
                f'      salud: {factors["salud"]},',
                f'      competencia: {factors["competencia"]},',
                f'      riesgo: {factors["riesgo"]},',
                f'      costos: {factors["costos"]},',
                "    },",
                f'    predictedRoi: {zone["predictedRoi"]},',
                "  },",
            ]
        )
    zone_lines.append("];")
    FRONTEND_ZONE_FILE.write_text("\n".join(zone_lines) + "\n", encoding="utf-8")


def main() -> None:
    ensure_directories()
    generate_raw_data()
    feature_rows = build_feature_store()
    scored_rows = train_profitability_model(feature_rows)
    export_frontend_inputs(scored_rows)
    print("Pipeline ejecutado correctamente.")
    print(f"Tablas finales disponibles en: {FINAL_DIR}")


if __name__ == "__main__":
    main()
