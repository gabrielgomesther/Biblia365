import React from "react";
import { ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { parseReadingRef } from "@/lib/jwLibraryLinks";
import { bookStartsForDay } from "@/lib/studyPubLinks";
import BookStudyLinks from "./BookStudyLinks";

export default function DayCard({ day, reading, focus, entry, onToggle, onDateChange }) {
  const links = parseReadingRef(reading);
  const bookStarts = bookStartsForDay(day);
  const completed = !!entry?.completed;

  return (
    <article
      id={`day-${day}`}
      className={`group relative rounded-2xl border p-5 sm:p-6 transition-all duration-500 scroll-mt-28 ${
        completed
          ? "border-[hsl(var(--secondary))]/30 bg-[hsl(var(--secondary))]/[0.06]"
          : "border-border bg-card hover:border-[hsl(var(--accent))]/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-heading text-2xl sm:text-3xl text-foreground">{day}</span>
            <span className="text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Dia
            </span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2 leading-snug">
            {reading}
          </h3>
          <p className="font-body text-sm sm:text-base italic text-muted-foreground leading-relaxed mb-4">
            {focus}
          </p>
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ${link.label} no JW Library`}
                className="inline-flex items-center gap-1.5 min-h-[2.75rem] px-4 rounded-full border border-[hsl(var(--accent))]/50 text-xs sm:text-sm font-medium text-foreground hover:bg-[hsl(var(--accent))]/10 hover:border-[hsl(var(--accent))] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2"
              >
                {link.label}
                <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
              </a>
            ))}
          </div>
          {bookStarts.map((book) => (
            <BookStudyLinks key={book} book={book} />
          ))}
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 shrink-0 sm:w-44 sm:border-l sm:border-border sm:pl-5">
          <label className="flex items-center gap-2 cursor-pointer min-h-[2.75rem] min-w-[2.75rem] justify-center">
            <Checkbox
              checked={completed}
              onCheckedChange={() => onToggle(day)}
              aria-label={`Marcar dia ${day} como concluído`}
              className="w-5 h-5 data-[state=checked]:bg-[hsl(var(--secondary))] data-[state=checked]:border-[hsl(var(--secondary))]"
            />
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Concluído</span>
          </label>
          <div className="flex flex-col items-center sm:items-end w-full">
            <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground/70 mb-1 sm:text-right">
              Data de conclusão
            </span>
            <input
              type="date"
              value={entry?.date || ""}
              onChange={(e) => onDateChange(day, e.target.value)}
              aria-label={`Data de conclusão do dia ${day}`}
              className="w-full sm:w-36 bg-transparent border-b border-border text-xs sm:text-sm text-foreground px-1 py-2 text-center sm:text-right focus:outline-none focus:border-[hsl(var(--accent))] min-h-[2.75rem]"
            />
          </div>
        </div>
      </div>
    </article>
  );
}