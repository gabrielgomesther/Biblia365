import readingPlan from "@/lib/readingPlanData";

// Um emoji por etapa, seguindo a ordem histórica da Bíblia.
const STAGE_ICONS = [
  "🌅", // 1. Da Criação aos Patriarcas
  "🔥", // 2. Jó e o Êxodo
  "📜", // 3. A Lei e o Deserto
  "⚔️", // 4. A Conquista e os Juízes
  "👑", // 5. A Monarquia e os Salmos de Davi
  "💡", // 6. Salomão e a Sabedoria
  "✡️", // 7. O Reino Dividido e os Profetas
  "🏛️", // 8. Isaías, Jeremias e a Queda de Jerusalém
  "🦁", // 9. O Exílio em Babilônia e a Restauração
  "✝️", // 10. A Vida e o Ministério de Jesus Cristo
  "🕊️", // 11. A Congregação Primitiva e as Viagens de Paulo
  "🌟", // 12. As Epístolas Finais e a Revelação
];

export const XP_PER_DAY = 10;

export const stages = readingPlan.map((m, i) => ({
  month: m.month,
  title: m.title,
  icon: STAGE_ICONS[i] || "📖",
  totalDays: m.days.length,
  dayNumbers: m.days.map((d) => d.day),
}));

export function stageStates(progress) {
  return stages.map((s) => {
    const completed = s.dayNumbers.filter((d) => progress[d]?.completed).length;
    return { ...s, completed, unlocked: completed === s.totalDays };
  });
}

export function totalXP(completedCount) {
  return completedCount * XP_PER_DAY;
}