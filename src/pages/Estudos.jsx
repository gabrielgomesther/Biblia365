import React, { useMemo, useState } from "react";
import { BookOpenCheck, Search } from "lucide-react";
import AppTabs from "@/components/AppTabs";
import StudyModule from "@/components/study/StudyModule";
import { PHASES } from "@/lib/studySessions";

const moduleCount = PHASES.reduce((total, phase) => total + phase.modules.length, 0);

export default function Estudos() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const visiblePhases = useMemo(() => {
    if (!normalizedQuery) return PHASES;
    return PHASES.map((phase) => ({
      ...phase,
      modules: phase.modules.filter(([title, subs]) => {
        const searchableText = [title, ...subs.flatMap(([subtitle, topics]) => [subtitle, ...topics])]
          .join(" ")
          .toLocaleLowerCase("pt-BR");
        return searchableText.includes(normalizedQuery);
      }),
    })).filter((phase) => phase.modules.length > 0);
  }, [normalizedQuery]);

  return (
    <div className="min-h-screen bg-background font-body">
      <AppTabs />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-10 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10">
              <BookOpenCheck className="h-6 w-6 text-[hsl(var(--accent))]" aria-hidden="true" />
            </span>
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Caderno de estudos</p>
              <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Estudos bíblicos</h1>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                Explore as fases, os módulos e os tópicos organizados no seu roteiro de estudo.
                O conteúdo fica disponível offline; os links de referência abrem quando houver conexão.
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                {PHASES.length} fases · {moduleCount} módulos
              </p>
            </div>
          </div>
        </header>

        <label className="mb-8 flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Buscar fases, módulos ou tópicos</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar módulo ou tópico…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="space-y-4">
          {visiblePhases.map((phase, phaseIndex) => (
            <details
              key={phase.title}
              open={Boolean(normalizedQuery) || phaseIndex === 0}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-3">
                  <span className="font-heading text-lg text-[hsl(var(--accent))]">{String(PHASES.findIndex((item) => item.title === phase.title) + 1).padStart(2, "0")}</span>
                  <span className="font-heading text-base text-foreground sm:text-lg">{phase.title}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {phase.modules.length} {phase.modules.length === 1 ? "módulo" : "módulos"}
                </span>
              </summary>
              <div className="space-y-3 border-t border-border p-3 sm:p-4">
                {phase.modules.map(([title, subs], index) => (
                  <StudyModule
                    key={`${title}-${index}`}
                    number={`${String(index + 1).padStart(2, "0")}`}
                    title={title}
                    subs={subs}
                  />
                ))}
              </div>
            </details>
          ))}
          {visiblePhases.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
              Nenhum tópico corresponde a “{query}”.
            </p>
          )}
        </div>
      </main>
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground safe-pb">
        O plano completo e os tópicos organizados são armazenados no próprio aplicativo.
      </footer>
    </div>
  );
}
