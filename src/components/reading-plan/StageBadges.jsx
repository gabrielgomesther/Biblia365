import React from "react";
import { Check } from "lucide-react";
import { stageStates } from "@/lib/stages";

export default function StageBadges({ progress }) {
  const states = stageStates(progress);
  const unlockedCount = states.filter((s) => s.unlocked).length;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-10 py-10 sm:py-14">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="font-heading text-xl sm:text-2xl text-foreground">Conquistas</h2>
        <span className="text-xs text-muted-foreground">
          {unlockedCount}/12 etapas desbloqueadas
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {states.map((s) => (
          <div
            key={s.month}
            className={`relative rounded-2xl border p-4 text-center transition-all ${
              s.unlocked
                ? "border-[hsl(var(--secondary))]/40 bg-[hsl(var(--secondary))]/[0.07]"
                : "border-border bg-card"
            }`}
          >
            {s.unlocked && (
              <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--secondary))] text-secondary-foreground">
                <Check className="w-3 h-3" />
              </span>
            )}
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
                s.unlocked ? "bg-[hsl(var(--accent))]/15" : "bg-muted"
              }`}
            >
              <span className={`text-2xl ${s.unlocked ? "" : "opacity-40 grayscale"}`}>
                {s.icon}
              </span>
            </div>
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Etapa {s.month}
            </p>
            <h3 className="font-heading text-sm text-foreground leading-tight mb-2 min-h-[2.5rem]">
              {s.title}
            </h3>
            <p
              className={`text-xs ${
                s.unlocked ? "text-[hsl(var(--secondary))]" : "text-muted-foreground"
              }`}
            >
              {s.unlocked ? "Concluída" : `${s.completed}/${s.totalDays} dias`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}