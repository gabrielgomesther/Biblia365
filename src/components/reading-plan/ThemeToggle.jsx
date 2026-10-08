import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const ORDER = ["system", "light", "dark"];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? theme || "system" : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;
  const label = current === "light" ? "Claro" : current === "dark" ? "Escuro" : "Sistema";

  return (
    <button
      type="button"
      aria-label={`Tema atual: ${label}. Toque para alternar`}
      onClick={() => setTheme(next)}
      className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border bg-card text-foreground hover:border-[hsl(var(--accent))] transition-colors select-none"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}