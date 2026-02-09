import { modules } from "./modules/moduleCatalog.js";
import { zones } from "./modules/zoneData.js";
import { rankZones } from "./modules/scoringEngine.js";

const moduleListElement = document.getElementById("moduleList");
const moduleTemplate = document.getElementById("moduleTemplate");
const activeModulesElement = document.getElementById("activeModules");
const zoneResultsElement = document.getElementById("zoneResults");

let selectedModuleIds = new Set(modules.map((module) => module.id));

function getActiveModules() {
  return modules.filter((module) => selectedModuleIds.has(module.id));
}

function renderModules() {
  moduleListElement.innerHTML = "";

  modules.forEach((module) => {
    const fragment = moduleTemplate.content.cloneNode(true);
    const checkbox = fragment.querySelector(".module-toggle");

    fragment.querySelector(".module-name").textContent = module.name;
    fragment.querySelector(".module-description").textContent = module.description;

    checkbox.checked = selectedModuleIds.has(module.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedModuleIds.add(module.id);
      } else {
        selectedModuleIds.delete(module.id);
      }
      renderResults();
    });

    moduleListElement.appendChild(fragment);
  });
}

function renderResults() {
  const activeModules = getActiveModules();

  activeModulesElement.innerHTML = activeModules.length
    ? activeModules.map((module) => `<span class="tag">${module.name}</span>`).join("")
    : '<span class="tag">Sin módulos activos</span>';

  const ranked = rankZones(zones, activeModules);
  zoneResultsElement.innerHTML = ranked
    .map(
      (zone, index) => `
      <article class="zone-card">
        <div class="zone-top">
          <h3 class="zone-name">#${index + 1} ${zone.name}</h3>
          <span class="zone-score">${zone.score}/100</span>
        </div>
        <p class="zone-breakdown">${zone.breakdown}</p>
        <p class="zone-breakdown"><strong>ROI estimado:</strong> ${zone.predictedRoi ?? "N/D"}%</p>
      </article>`
    )
    .join("");
}

renderModules();
renderResults();
