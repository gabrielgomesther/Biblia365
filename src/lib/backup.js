// Backup e restauração do progresso de leitura (localStorage).

const PROGRESS_KEY = "chronos_biblia_cronologica_progress_v1";
const LAST_BACKUP_KEY = "chronos_biblia_cronologica_last_backup_v1";
const BACKUP_RECOMMENDATION_DAYS = 30;

export function getProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function exportBackup() {
  const progress = getProgress();
  const payload = {
    app: "A Bíblia Cronológica — Guia de Leitura em 365 Dias",
    version: 1,
    exportedAt: new Date().toISOString(),
    daysCompleted: Object.values(progress).filter((p) => p.completed).length,
    progress,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup-biblia-cronologica-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
}

export async function importBackup(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  const raw = data && data.progress && typeof data.progress === "object" ? data.progress : data;

  const cleaned = {};
  for (const [key, value] of Object.entries(raw || {})) {
    const day = Number(key);
    if (!Number.isInteger(day) || day < 1 || day > 365) continue;
    if (value && typeof value === "object" && typeof value.completed === "boolean") {
      cleaned[day] = { completed: value.completed, date: value.date || null };
    }
  }

  if (!Object.keys(cleaned).length) {
    throw new Error("Nenhum dia válido encontrado no arquivo.");
  }

  setProgress(cleaned);
  localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
  return Object.values(cleaned).filter((p) => p.completed).length;
}

export function getLastBackupDate() {
  try {
    return localStorage.getItem(LAST_BACKUP_KEY);
  } catch {
    return null;
  }
}

export function isBackupRecommended() {
  const last = getLastBackupDate();
  if (!last) return true;
  const diffDays = (Date.now() - new Date(last).getTime()) / 86400000;
  return diffDays >= BACKUP_RECOMMENDATION_DAYS;
}