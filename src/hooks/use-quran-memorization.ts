"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

export type MemoStatus = "learning" | "memorized";

/** key = "${surah}:${ayah}" */
export type MemoMap = Record<string, MemoStatus>;

const STORAGE_KEY = "quran-memorization";

export function useQuranMemorization() {
  const [memo, setMemo] = useLocalStorage<MemoMap>(STORAGE_KEY, {});

  const getStatus = useCallback(
    (surah: number, ayah: number): MemoStatus | null => {
      return memo[`${surah}:${ayah}`] ?? null;
    },
    [memo],
  );

  /** Cycles: none → learning → memorized → none */
  const cycleStatus = useCallback(
    (surah: number, ayah: number) => {
      const key = `${surah}:${ayah}`;
      setMemo((prev) => {
        const current = prev[key] ?? null;
        const next: MemoStatus | null =
          current === null ? "learning" : current === "learning" ? "memorized" : null;
        const updated = { ...prev };
        if (next === null) {
          delete updated[key];
        } else {
          updated[key] = next;
        }
        return updated;
      });
    },
    [setMemo],
  );

  /** Count memorized ayahs in a specific surah */
  const surahMemoCount = useCallback(
    (surah: number): number => {
      return Object.entries(memo).filter(([k, v]) => k.startsWith(`${surah}:`) && v === "memorized")
        .length;
    },
    [memo],
  );

  /** Total counts across all surahs */
  const totals = useCallback((): { memorized: number; learning: number } => {
    let memorized = 0;
    let learning = 0;
    for (const v of Object.values(memo)) {
      if (v === "memorized") memorized++;
      else learning++;
    }
    return { memorized, learning };
  }, [memo]);

  /** Group by surah for settings view */
  const bysurah = useCallback((): Array<{
    surah: number;
    memorized: number;
    learning: number;
  }> => {
    const map: Record<number, { memorized: number; learning: number }> = {};
    for (const [k, v] of Object.entries(memo)) {
      const surahNum = parseInt(k.split(":")[0] ?? "0", 10);
      if (!map[surahNum]) map[surahNum] = { memorized: 0, learning: 0 };
      if (v === "memorized") map[surahNum]!.memorized++;
      else map[surahNum]!.learning++;
    }
    return Object.entries(map)
      .map(([s, counts]) => ({ surah: Number(s), ...counts }))
      .sort((a, b) => a.surah - b.surah);
  }, [memo]);

  const clearAll = useCallback(() => setMemo({}), [setMemo]);

  return { memo, getStatus, cycleStatus, surahMemoCount, totals, bysurah, clearAll };
}
