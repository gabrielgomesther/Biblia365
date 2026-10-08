import React from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex-1 inline-flex items-center justify-center gap-2 min-h-[2.75rem] text-sm font-medium transition-colors ${
    isActive
      ? "text-foreground border-b-2 border-[hsl(var(--accent))]"
      : "text-muted-foreground border-b-2 border-transparent"
  }`;

export default function AppTabs() {
  return (
    <nav className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border safe-pt">
      <div className="max-w-4xl mx-auto flex">
        <NavLink to="/" end className={linkClass}>
          <BookOpen className="w-4 h-4" /> Leitura 365
        </NavLink>
        <NavLink to="/estudos" className={linkClass}>
          <Search className="w-4 h-4" /> Estudos
        </NavLink>
      </div>
    </nav>
  );
}