"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/i18n-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useQuranMemorization } from "@/hooks/use-quran-memorization";
import styles from "./page.module.css";

// ── Types mirrored from their source pages/hooks ─────────────────────────────

type PrayerLog = Record<string, string[]>; // "YYYY-MM-DD" → prayer names
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

type DayLog = { date: string; done: string[] };

type FastingRecord = { fastedDays: number[] };

type StoredCounts = Record<string, number>;

type DuaEntry = { id: string; title: string; text: string; notes?: string; tag: string; createdAt: string };

type AzkarProgress = {
  morning: { completed: number[]; date: string };
  evening: { completed: number[]; date: string };
};

type QuranProgress = {
  lastSurah: number | null;
  visitedSurahs: number[];
  bookmarks: { surah: number; ayah: number }[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function fastingStorageKey(year: number, month: number) {
  return `fasting-${year}-${String(month).padStart(2, "0")}`;
}

function currentStreak(log: PrayerLog): number {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().slice(0, 10);
    const prayed = log[key] ?? [];
    if (PRAYERS.every((p) => prayed.includes(p))) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  const [prayerLog] = useLocalStorage<PrayerLog>("prayer-log", {});
  const [ibadahLog] = useLocalStorage<DayLog[]>("ibadah-log", []);
  const [tasbeehCounts] = useLocalStorage<StoredCounts>("tasbeeh-counts", {});
  const [duaEntries] = useLocalStorage<DuaEntry[]>("dua-journal", []);
  const [nameFavs] = useLocalStorage<number[]>("allah-names-favorites", []);
  const [azkarProgress] = useLocalStorage<AzkarProgress>("azkar-progress", {
    morning: { completed: [], date: "" },
    evening: { completed: [], date: "" },
  });
  const [quranProgress] = useLocalStorage<QuranProgress>("quran-progress", {
    lastSurah: null,
    visitedSurahs: [],
    bookmarks: [],
  });
  const { totals: memoTotals } = useQuranMemorization();

  const fastingKey = useMemo(() => {
    const now = new Date();
    return fastingStorageKey(now.getFullYear(), now.getMonth() + 1);
  }, []);
  const [fastingRecord] = useLocalStorage<FastingRecord>(fastingKey, { fastedDays: [] });

  // useMemo ← needs mounted flag to avoid SSR mismatch
  const stats = useMemo(() => {
    const today = todayKey();
    const streak = currentStreak(prayerLog);
    const todayPrayed = (prayerLog[today] ?? []).length;

    const ibadahToday = ibadahLog.find((l) => l.date === today)?.done.length ?? 0;

    const tasbeehTotal = Object.values(tasbeehCounts).reduce((sum, n) => sum + n, 0);

    const fastsThisMonth = fastingRecord.fastedDays.length;

    const azkarMorningDone =
      azkarProgress.morning?.date === today ? (azkarProgress.morning.completed?.length ?? 0) : 0;
    const azkarEveningDone =
      azkarProgress.evening?.date === today ? (azkarProgress.evening.completed?.length ?? 0) : 0;
    const azkarToday = azkarMorningDone + azkarEveningDone;

    const quranSurahs = quranProgress.visitedSurahs?.length ?? 0;
    const memo = memoTotals();

    return {
      streak,
      todayPrayed,
      ibadahToday,
      tasbeehTotal,
      fastsThisMonth,
      azkarToday,
      quranSurahs,
      memorized: memo.memorized,
      learning: memo.learning,
      duaEntries: duaEntries.length,
      nameFavs: nameFavs.length,
    };
  }, [
    prayerLog,
    ibadahLog,
    tasbeehCounts,
    fastingRecord,
    azkarProgress,
    quranProgress,
    memoTotals,
    duaEntries,
    nameFavs,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasAnyData =
    stats.streak > 0 ||
    stats.todayPrayed > 0 ||
    stats.ibadahToday > 0 ||
    stats.azkarToday > 0 ||
    stats.tasbeehTotal > 0 ||
    stats.fastsThisMonth > 0 ||
    stats.duaEntries > 0 ||
    stats.nameFavs > 0 ||
    stats.quranSurahs > 0 ||
    stats.learning > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("stats.title")}</h1>
        <p className={styles.subtitle}>{t("stats.subtitle")}</p>
      </header>

      {mounted && !hasAnyData && (
        <p className={styles.emptyMsg}>{t("stats.noData")}</p>
      )}

      {mounted && (
        <>
          {/* Prayer */}
          <section className={styles.section}>
            <div className={`${styles.statCard} ${styles.statCardAccent}`}>
              <div className={styles.statIcon}>🔥</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.prayerStreak")}</p>
                <p className={styles.statValue}>
                  {stats.streak} <span className={styles.statUnit}>{t("stats.days")}</span>
                </p>
                <p className={styles.statSub}>
                  {t("stats.ibadahToday")}: {stats.todayPrayed}{" "}
                  <span className={styles.statUnit}>{t("stats.of")} 5</span>
                </p>
              </div>
              <Link href="/prayer-streak" className={styles.statLink}>→</Link>
            </div>
          </section>

          {/* Grid of stat cards */}
          <section className={styles.grid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🌅</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.azkarToday")}</p>
                <p className={styles.statValue}>{stats.azkarToday}</p>
              </div>
              <Link href="/azkar" className={styles.statLink}>→</Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📿</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.tasbeehTotal")}</p>
                <p className={styles.statValue}>
                  {stats.tasbeehTotal.toLocaleString()}{" "}
                  <span className={styles.statUnit}>{t("stats.times")}</span>
                </p>
              </div>
              <Link href="/tasbeeh" className={styles.statLink}>→</Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🌙</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.fastingMonth")}</p>
                <p className={styles.statValue}>
                  {stats.fastsThisMonth}{" "}
                  <span className={styles.statUnit}>{t("stats.days")}</span>
                </p>
              </div>
              <Link href="/fasting" className={styles.statLink}>→</Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>☑️</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.ibadahToday")}</p>
                <p className={styles.statValue}>
                  {stats.ibadahToday}{" "}
                  <span className={styles.statUnit}>{t("stats.of")} 8</span>
                </p>
              </div>
              <Link href="/ibadah" className={styles.statLink}>→</Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📖</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.quranSurahs")}</p>
                <p className={styles.statValue}>
                  {stats.quranSurahs}{" "}
                  <span className={styles.statUnit}>{t("stats.of")} 114</span>
                </p>
              </div>
              <Link href="/quran" className={styles.statLink}>→</Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.quranMemo")}</p>
                <p className={styles.statValue}>{stats.memorized}</p>
                {stats.learning > 0 && (
                  <p className={styles.statSub}>📖 {stats.learning} {t("memo.status.learning")}</p>
                )}
              </div>
              <Link href="/quran" className={styles.statLink}>→</Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.duaJournal")}</p>
                <p className={styles.statValue}>{stats.duaEntries}</p>
              </div>
              <Link href="/duas/journal" className={styles.statLink}>→</Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✨</div>
              <div className={styles.statBody}>
                <p className={styles.statLabel}>{t("stats.namesFav")}</p>
                <p className={styles.statValue}>{stats.nameFavs}</p>
              </div>
              <Link href="/names" className={styles.statLink}>→</Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
