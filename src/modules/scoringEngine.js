export function rankZones(zones, activeModules) {
  if (activeModules.length === 0) {
    return zones.map((zone) => ({
      name: zone.name,
      score: 0,
      breakdown: "Activa al menos un módulo para calcular el score.",
    }));
  }

  const totalWeight = activeModules.reduce((sum, module) => sum + module.weight, 0);

  return zones
    .map((zone) => {
      let weightedScore = 0;
      const details = [];

      for (const module of activeModules) {
        const value = zone.factors[module.id] ?? 0;
        weightedScore += value * module.weight;
        details.push(`${module.name}: ${value}`);
      }

      return {
        name: zone.name,
        score: Math.round(weightedScore / totalWeight),
        breakdown: details.join(" · "),
      };
    })
    .sort((a, b) => b.score - a.score);
}
