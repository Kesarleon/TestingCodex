'use client';

import type { ZoneScoreResult } from '@/domain/ports/ScoringPort';

interface AnalysisPanelProps {
  result: ZoneScoreResult | null;
}

const semaforoByClass = {
  Excelente: 'bg-emerald-500',
  Alta: 'bg-lime-500',
  Media: 'bg-amber-500',
  Riesgosa: 'bg-red-500',
};

export function AnalysisPanel({ result }: AnalysisPanelProps) {
  if (!result) {
    return <section className="rounded-xl border border-slate-300 bg-white p-4">Selecciona una zona.</section>;
  }

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-4">
      <h3 className="text-base font-semibold">Análisis de zona: {result.zoneName}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-100 p-3">
          <p className="text-xs uppercase text-slate-500">Score total</p>
          <p className="text-2xl font-bold">{result.totalScore}</p>
        </div>
        <div className="rounded-lg bg-slate-100 p-3">
          <p className="text-xs uppercase text-slate-500">Clasificación</p>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <span className={`inline-block h-3 w-3 rounded-full ${semaforoByClass[result.classification]}`} />
            {result.classification}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {result.moduleScores.map((moduleScore) => (
          <div key={moduleScore.moduleId} className="rounded-md border border-slate-200 p-2 text-sm">
            <div className="flex items-center justify-between">
              <span>{moduleScore.moduleName}</span>
              <span className="font-semibold">{moduleScore.score}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
