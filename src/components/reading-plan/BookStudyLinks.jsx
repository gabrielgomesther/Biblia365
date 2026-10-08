import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { RSG_URL, guiaUrlForBook } from "@/lib/studyPubLinks";

export default function BookStudyLinks({ book }) {
  return (
    <div className="mt-4 rounded-xl border border-[hsl(var(--accent))]/25 bg-[hsl(var(--accent))]/[0.05] p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <BookOpen className="w-4 h-4 text-[hsl(var(--accent))]" aria-hidden="true" />
        <span className="font-heading text-sm text-foreground">Estudar {book}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={guiaUrlForBook(book)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Estudar ${book} no Guia de Pesquisa`}
          className="inline-flex items-center gap-1.5 min-h-[2.5rem] px-3 rounded-full border border-[hsl(var(--secondary))]/40 bg-card text-xs font-medium text-foreground hover:bg-[hsl(var(--secondary))]/10 transition-colors"
        >
          {book} no Guia de Pesquisa
          <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
        </a>
        <a
          href={RSG_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir a publicação Guia de Pesquisa no JW Library"
          className="inline-flex items-center gap-1.5 min-h-[2.5rem] px-3 rounded-full border border-[hsl(var(--accent))]/40 bg-card text-xs font-medium text-foreground hover:bg-[hsl(var(--accent))]/10 transition-colors"
        >
          Guia de Pesquisa
          <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}