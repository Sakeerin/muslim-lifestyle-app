"use client";

import { useMemo } from "react";
import { useI18n } from "@/i18n/i18n-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import styles from "./page.module.css";

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type Prayer = (typeof PRAYERS)[number];

const PRAYER_ICONS: Record<Prayer, string> = {
  Fajr: "🌄",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌆",
  Isha: "🌙",
};

type PrayerLog = Record<string, string[]>; // "YYYY-MM-DD" → prayer names completed

const STORAGE_KEY = "prayer-log";

function dateKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
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

export default function PrayerStreakPage() {
  const { t } = useI18n();
  const [log, setLog] = useLocalStorage<PrayerLog>(STORAGE_KEY, {});

  const today = todayDate();
  const todayPrayed = log[today] ?? [];

  const streak = useMemo(() => currentStreak(log), [log]);

  const togglePrayer = (prayer: Prayer) => {
    const current = log[today] ?? [];
    const updated = current.includes(prayer)
      ? current.filter((p) => p !== prayer)
      : [...current, prayer];
    setLog({ ...log, [today]: updated });
  };

  // Past 35 days for grid (5 weeks × 7 days), oldest first
  const pastDays = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => {
      const daysAgo = 34 - i; // 34 days ago → today
      const key = dateKey(daysAgo);
      const prayed = log[key] ?? [];
      const count = PRAYERS.filter((p) => prayed.includes(p)).length;
      return { key, daysAgo, count, isToday: daysAgo === 0 };
    });
  }, [log]);

  const prayerNameKey = (p: Prayer): string => {
    const keys: Record<Prayer, string> = {
      Fajr: "prayer.Fajr",
      Dhuhr: "prayer.Dhuhr",
      Asr: "prayer.Asr",
      Maghrib: "prayer.Maghrib",
      Isha: "prayer.Isha",
    };
    return keys[p];
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1>{t("streak.title")}</h1>
        <p>{t("streak.subtitle")}</p>
      </section>

      {/* Streak counter */}
      <section className={styles.streakCard}>
        <span className={styles.streakIcon}>🔥</span>
        <div>
          <p className={styles.streakCount}>{streak}</p>
          <p className={styles.streakLabel}>{t("streak.currentStreak")}</p>
        </div>
      </section>

      {/* Today's prayers */}
      <section className={styles.todaySection}>
        <h2>{t("streak.todayPrayers")}</h2>
        <div className={styles.prayerGrid}>
          {PRAYERS.map((prayer) => {
            const done = todayPrayed.includes(prayer);
            return (
              <button
                key={prayer}
                type="button"
                className={`${styles.prayerBtn} ${done ? styles.prayerBtnDone : ""}`}
                onClick={() => togglePrayer(prayer)}
                aria-pressed={done}
              >
                <span className={styles.prayerIcon}>{PRAYER_ICONS[prayer]}</span>
                <span className={styles.prayerName}>{t(prayerNameKey(prayer))}</span>
                {done && <span className={styles.prayerCheck}>✓</span>}
              </button>
            );
          })}
        </div>
        <p className={styles.prayerStatus}>
          {todayPrayed.length === 5
            ? t("streak.allDone")
            : t("streak.todayCount", {
                done: String(todayPrayed.length),
                total: "5",
              })}
        </p>
      </section>

      {/* 35-day history grid */}
      <section className={styles.historySection}>
        <h2>{t("streak.history")}</h2>
        <div className={styles.historyGrid}>
          {pastDays.map(({ key, count, isToday }) => (
            <div
              key={key}
              title={`${key}: ${count}/5`}
              className={`${styles.historyCell}
                ${count === 5 ? styles.historyCellFull : ""}
                ${count > 0 && count < 5 ? styles.historyCellPartial : ""}
                ${count === 0 ? styles.historyCellEmpty : ""}
                ${isToday ? styles.historyCellToday : ""}`}
            />
          ))}
        </div>
        <div className={styles.historyLegend}>
          <span className={`${styles.legendDot} ${styles.full}`} /> {t("streak.legendFull")}
          <span className={`${styles.legendDot} ${styles.partial}`} /> {t("streak.legendPartial")}
          <span className={`${styles.legendDot} ${styles.empty}`} /> {t("streak.legendMissed")}
        </div>
      </section>

      <p className={styles.hint}>{t("streak.hint")}</p>
    </div>
  );
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
