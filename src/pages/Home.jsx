import React, { useEffect, useRef, useState } from "react";
import readingPlan from "@/lib/readingPlanData";
import useReadingProgress from "@/hooks/useReadingProgress";
import ProgressHero from "@/components/reading-plan/ProgressHero";
import MonthNav from "@/components/reading-plan/MonthNav";
import MonthSection from "@/components/reading-plan/MonthSection";
import StageBadges from "@/components/reading-plan/StageBadges";
import AppTabs from "@/components/AppTabs";

const TOTAL_DAYS = 365;
const PROGRESS_KEY = "chronos_biblia_cronologica_progress_v1";

function monthOfDay(day) {
  for (const m of readingPlan) {
    if (m.days.some((d) => d.day === day)) return m.month;
  }
  return 1;
}

function firstIncompleteDay(progress) {
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    if (!progress[d]?.completed) return d;
  }
  return null;
}

function lastCompletedDay(progress) {
  let max = 0;
  for (const key in progress) {
    if (progress[key]?.completed) {
      const d = Number(key);
      if (d > max) max = d;
    }
  }
  return max || null;
}

function loadInitialMonth(progress) {
  const last = lastCompletedDay(progress);
  if (last) return monthOfDay(last);
  const next = firstIncompleteDay(progress);
  return next ? monthOfDay(next) : 1;
}

export default function Home() {
  const { progress, toggleDay, setDate, completedCount } = useReadingProgress();
  const [activeMonth, setActiveMonth] = useState(() => loadInitialMonth(loadRawProgress()));
  const pendingScrollDay = useRef(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // After switching month, scroll a pending day into view once it renders.
  useEffect(() => {
    if (pendingScrollDay.current == null) return;
    const day = pendingScrollDay.current;
    pendingScrollDay.current = null;
    const el = document.getElementById(`day-${day}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeMonth]);

  // On first open, focus on the last day the reader completed.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const last = lastCompletedDay(loadRawProgress());
    if (!last) return;
    const el = document.getElementById(`day-${last}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleJump = () => {
    const day = firstIncompleteDay(progressRef.current);
    if (day == null) return;
    const targetMonth = monthOfDay(day);
    if (targetMonth === activeMonth) {
      const el = document.getElementById(`day-${day}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      pendingScrollDay.current = day;
      setActiveMonth(targetMonth);
    }
  };

  const activeMonthData = readingPlan.find((m) => m.month === activeMonth) || readingPlan[0];

  return (
    <div className="min-h-screen bg-background font-body">
      <AppTabs />
      <ProgressHero completedCount={completedCount} total={TOTAL_DAYS} onJump={handleJump} progress={progress} />
      <StageBadges progress={progress} />
      <MonthNav months={readingPlan} activeMonth={activeMonth} onSelect={setActiveMonth} />
      <main className="max-w-4xl mx-auto px-4 sm:px-10">
        <MonthSection
          key={activeMonthData.month}
          month={activeMonthData}
          progress={progress}
          onToggle={toggleDay}
          onDateChange={setDate}
        />
      </main>
      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground px-6 safe-pb">
        <p>
          Baseado na Tradução do Novo Mundo das Escrituras Sagradas. Os links abrem o capítulo
          exato no JW Library (ou no jw.org, caso o app não esteja instalado). Seu progresso é
          salvo automaticamente neste navegador.
        </p>
      </footer>
    </div>
  );
}

function loadRawProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}