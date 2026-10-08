import React from "react";
import DayCard from "./DayCard";

export default function MonthSection({ month, progress, onToggle, onDateChange }) {
  const completedInMonth = month.days.filter((d) => progress[d.day]?.completed).length;

  return (
    <section id={`month-${month.month}`} className="py-12 sm:py-16 scroll-mt-24">
      <div className="mb-8 sm:mb-10 flex flex-wrap items-baseline gap-3 sm:gap-4">
        <span className="font-heading text-xs sm:text-sm uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
          Mês {month.month}
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground">{month.title}</h2>
        <span className="ml-auto text-xs sm:text-sm text-muted-foreground">
          {completedInMonth}/{month.days.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-5">
        {month.days.map((d) => (
          <DayCard
            key={d.day}
            day={d.day}
            reading={d.ref}
            focus={d.focus}
            entry={progress[d.day]}
            onToggle={onToggle}
            onDateChange={onDateChange}
          />
        ))}
      </div>
    </section>
  );
}