import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "chronos_biblia_cronologica_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function useReadingProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Pede armazenamento persistente ao navegador para que o progresso não seja
  // descartado sob pressão de espaço (melhor esforço; depende do navegador).
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

  const toggleDay = useCallback((day) => {
    setProgress((prev) => {
      if (prev[day]?.completed) {
        const next = { ...prev };
        delete next[day];
        return next;
      }
      return { ...prev, [day]: { completed: true, date: prev[day]?.date || todayISO() } };
    });
  }, []);

  const setDate = useCallback((day, date) => {
    setProgress((prev) => ({
      ...prev,
      [day]: { completed: !!date, date },
    }));
  }, []);

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  return { progress, toggleDay, setDate, completedCount };
}