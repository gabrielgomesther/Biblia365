import React, { useEffect, useState } from "react";
import { Download, Check, X } from "lucide-react";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator?.standalone === true
  );
}

export default function InstallPwaButton() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onBefore = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBefore);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (installed) return;
    if (deferred) {
      deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice?.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    // Sem prompt programático (ex.: iOS): mostra como instalar manualmente.
    setShowHelp((v) => !v);
  };

  if (installed) {
    return (
      <span
        className="inline-flex items-center gap-1.5 min-h-[2.75rem] px-3 rounded-full border border-[hsl(var(--secondary))]/40 bg-[hsl(var(--secondary))]/10 text-xs font-medium text-foreground select-none"
        aria-label="Aplicativo instalado"
      >
        <Check className="w-4 h-4 text-[hsl(var(--secondary))]" aria-hidden="true" />
        Instalado
      </span>
    );
  }

  return (
    <div className="relative">
      {showHelp && (
        <button
          type="button"
          aria-label="Fechar instruções de instalação"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setShowHelp(false)}
        />
      )}
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 min-h-[2.75rem] px-3 rounded-full border border-[hsl(var(--accent))]/50 bg-card text-xs font-medium text-foreground hover:bg-[hsl(var(--accent))]/10 transition-colors select-none"
        aria-label="Instalar aplicativo"
      >
        <Download className="w-4 h-4 text-[hsl(var(--accent))]" aria-hidden="true" />
        Instalar
      </button>
      {showHelp && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card shadow-lg p-4 text-xs leading-relaxed z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading text-sm text-foreground">Instalar o app</span>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              aria-label="Fechar"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-muted-foreground mb-2">
            <strong>iPhone/iPad:</strong> toque no botão <em>Compartilhar</em> e depois em{" "}
            <em>Adicionar à Tela de Início</em>.
          </p>
          <p className="text-muted-foreground">
            <strong>Android:</strong> abra o menu do navegador (︙) e escolha{" "}
            <em>Adicionar à tela inicial</em>.
          </p>
        </div>
      )}
    </div>
  );
}