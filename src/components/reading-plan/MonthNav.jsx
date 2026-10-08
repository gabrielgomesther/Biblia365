import React from "react";

export default function MonthNav({ months, activeMonth, onSelect }) {
  return (
    <nav
      aria-label="Navegação por mês"
      className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border overflow-x-auto safe-pt"
    >
      <div className="flex gap-1 px-4 sm:px-10 py-2 min-w-max">
        {months.map((m) => (
          <button
            key={m.month}
            type="button"
            onClick={() => onSelect(m.month)}
            aria-current={activeMonth === m.month ? "true" : undefined}
            className={`px-3 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap font-medium transition-colors min-h-[2.75rem] flex items-center select-none ${
              activeMonth === m.month
                ? "bg-[hsl(var(--accent))] text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mês {m.month}
          </button>
        ))}
      </div>
    </nav>
  );
}