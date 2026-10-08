import React from "react";
import ProfileSheet from "./ProfileSheet";
import ThemeToggle from "./ThemeToggle";
import InstallPwaButton from "./InstallPwaButton";
import { generateCertificate } from "@/lib/certificate";
import { Award } from "lucide-react";
import { XP_PER_DAY } from "@/lib/stages";

export default function ProgressHero({ completedCount, total, onJump, progress }) {
  const pct = Math.round((completedCount / total) * 100);
  const isComplete = completedCount >= total;
  const xp = completedCount * XP_PER_DAY;

  const latestDate = progress
    ? Object.values(progress)
        .filter((v) => v?.completed && v?.date)
        .map((v) => v.date)
        .sort()
        .pop()
    : null;

  const handleCertificate = () => {
    const enteredName = window.prompt("Nome para o certificado:", "Leitor");
    if (enteredName === null) return;
    generateCertificate({
      fullName: enteredName.trim() || "Leitor",
      completionDate: latestDate || new Date().toISOString(),
    });
  };

  return (
    <header className="relative border-b border-border bg-card">
      <div className="absolute top-2 right-4 sm:right-10 z-10 safe-pt flex items-center gap-2">
        <InstallPwaButton />
        <ThemeToggle />
        <ProfileSheet />
      </div>
      <div className="h-1 w-full bg-muted overflow-hidden">
        <div
          className="h-full bg-[hsl(var(--accent))] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-16 sm:py-24 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-muted-foreground mb-5">
          Guia de Leitura em 365 Dias
        </p>
        <h1 className="font-heading text-4xl sm:text-6xl text-foreground mb-5">
          A Bíblia Cronológica
        </h1>
        <div className="w-10 h-px bg-[hsl(var(--accent))] mx-auto mb-6" />
        <p className="font-body text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
          Uma jornada diária completa pelos 1.189 capítulos das Escrituras Sagradas, organizados
          na ordem histórica dos acontecimentos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="text-center">
            <span className="font-heading text-3xl text-foreground">{completedCount}</span>
            <span className="text-muted-foreground"> / {total} dias concluídos ({pct}%)</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 select-none">
            <span className="font-heading text-sm text-foreground">{xp} XP</span>
          </div>
          {isComplete ? (
            <button
              onClick={handleCertificate}
              className="min-h-[2.75rem] inline-flex items-center px-6 rounded-full bg-[hsl(var(--secondary))] text-secondary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              <Award className="w-4 h-4 mr-2" />
              Baixar certificado
            </button>
          ) : (
            <button
              onClick={onJump}
              className="min-h-[2.75rem] px-6 rounded-full bg-foreground text-background text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
            >
              Ir para o próximo dia
            </button>
          )}
        </div>
        {isComplete && (
          <p className="mt-8 font-heading text-lg text-[hsl(var(--secondary))]">
            🎉 Parabéns! Você concluiu toda a leitura cronológica da Bíblia.
          </p>
        )}
      </div>
    </header>
  );
}
