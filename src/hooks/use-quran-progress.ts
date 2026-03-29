"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

export type QuranProgress = {
  lastSurah: number | null;
  lastSurahName: string | null;
  lastSurahNameAr: string | null;
  lastReadAt: string | null;
  visitedSurahs: number[];
};

const STORAGE_KEY = "quran-progress";

const DEFAULT_PROGRESS: QuranProgress = {
  lastSurah: null,
  lastSurahName: null,
  lastSurahNameAr: null,
  lastReadAt: null,
  visitedSurahs: [],
};

export function useQuranProgress() {
  const [progress, setProgress] = useLocalStorage<QuranProgress>(STORAGE_KEY, DEFAULT_PROGRESS);

  // Reads localStorage directly so the function reference stays stable (no `progress` dep)
  const markAsRead = useCallback(
    (surahNumber: number, surahName: string, surahNameAr: string) => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const current: QuranProgress = raw ? (JSON.parse(raw) as QuranProgress) : DEFAULT_PROGRESS;
        // Guard: visitedSurahs may be corrupted in localStorage
        const existing = Array.isArray(current.visitedSurahs) ? current.visitedSurahs : [];
        const visited = existing.includes(surahNumber) ? existing : [...existing, surahNumber];
        setProgress({
          ...current,
          lastSurah: surahNumber,
          lastSurahName: surahName,
          lastSurahNameAr: surahNameAr,
          lastReadAt: new Date().toISOString(),
          visitedSurahs: visited,
        });
      } catch {}
    },
    [setProgress],
  );

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, [setProgress]);

  const exportData = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT_PROGRESS);
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quran-progress.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  }, []);

  const importData = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (typeof e.target?.result !== "string") return;
          const data = JSON.parse(e.target.result) as QuranProgress;
          // Validate structure: visitedSurahs must be an array of valid surah numbers (1–114)
          if (
            Array.isArray(data.visitedSurahs) &&
            data.visitedSurahs.every((n) => typeof n === "number" && n >= 1 && n <= 114)
          ) {
            setProgress({
              lastSurah: typeof data.lastSurah === "number" ? data.lastSurah : null,
              lastSurahName: typeof data.lastSurahName === "string" ? data.lastSurahName : null,
              lastSurahNameAr:
                typeof data.lastSurahNameAr === "string" ? data.lastSurahNameAr : null,
              lastReadAt: typeof data.lastReadAt === "string" ? data.lastReadAt : null,
              visitedSurahs: data.visitedSurahs,
            });
          }
        } catch {}
      };
      reader.readAsText(file);
    },
    [setProgress],
  );

  return { progress, markAsRead, resetProgress, exportData, importData };
}
