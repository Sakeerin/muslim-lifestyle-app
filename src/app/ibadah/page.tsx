"use client";

import { useMemo, useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

const ITEMS = [
  { id: "qiyam",     emoji: "🌙" },
  { id: "duha",      emoji: "☀️" },
  { id: "rawatib",   emoji: "🕌" },
  { id: "quranPage", emoji: "📖" },
  { id: "dhikr",     emoji: "📿" },
  { id: "istighfar", emoji: "🤲" },
  { id: "salawat",   emoji: "💚" },
  { id: "sadaqah",   emoji: "🌱" },
] as const;

type ItemId = (typeof ITEMS)[number]["id"];

type DayLog = {
  date: string;      // YYYY-MM-DD
  done: ItemId[];
};

const STORAGE_KEY = "ibadah-log";
const HISTORY_DAYS = 7;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function shortDay(iso: string, locale: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", { weekday: "short" });
}

export default function IbadahPage() {
  const { t } = useI18n();
  const { locale } = useI18n();
  const [log, setLog] = useLocalStorage<DayLog[]>(STORAGE_KEY, []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Today's record
  const today = todayStr();
  const todayLog = useMemo(
    () => log.find((l) => l.date === today) ?? { date: today, done: [] },
    [log, today],
  );

  const toggle = (id: ItemId) => {
    const alreadyDone = todayLog.done.includes(id);
    const newDone: ItemId[] = alreadyDone
      ? todayLog.done.filter((i) => i !== id)
      : [...todayLog.done, id];

    const updated: DayLog = { date: today, done: newDone };
    setLog((prev) => {
      const without = prev.filter((l) => l.date !== today);
      return [updated, ...without];
    });
  };

  const allDone = todayLog.done.length === ITEMS.length;
  const progress = todayLog.done.length;

  // History: last 7 days excluding today
  const history = useMemo(
    () =>
      Array.from({ length: HISTORY_DAYS }, (_, i) => {
        const ds = dateStr(i + 1);
        const entry = log.find((l) => l.date === ds);
        return { date: ds, count: entry?.done.length ?? 0 };
      }).reverse(),
    [log],
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <h1>{t("ibadah.title")}</h1>
        <p>{t("ibadah.subtitle")}</p>
      </section>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(progress / ITEMS.length) * 100}%` }}
          />
        </div>
        <p className={styles.progressLabel} suppressHydrationWarning>
          {allDone ? (
            <span className={styles.allDone}>
              <CheckCircle2 size={14} />
              {t("ibadah.allDone")}
            </span>
          ) : mounted ? (
            t("ibadah.progress", {
              done: String(progress),
              total: String(ITEMS.length),
            })
          ) : ""}
        </p>
      </div>

      {/* Checklist */}
      <section className={styles.list}>
        {ITEMS.map((item) => {
          const done = todayLog.done.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.item} ${done ? styles.itemDone : ""}`}
              onClick={() => toggle(item.id)}
              aria-pressed={done}
            >
              <span className={styles.itemEmoji}>{item.emoji}</span>
              <span className={styles.itemLabel}>{t(`ibadah.item.${item.id}`)}</span>
              <span className={`${styles.itemCheck} ${done ? styles.itemCheckDone : ""}`}>
                {done ? <CheckCircle2 size={18} /> : <span className={styles.emptyCheck} />}
              </span>
            </button>
          );
        })}
      </section>

      <p className={styles.hint}>{t("ibadah.hint")}</p>

      {/* 7-day history */}
      <section className={styles.historySection}>
        <h2 className={styles.historyTitle}>{t("ibadah.history")}</h2>
        <div className={styles.historyGrid}>
          {history.map((day) => {
            const pct = day.count / ITEMS.length;
            const cls =
              pct === 0
                ? styles.histCellNone
                : pct < 1
                  ? styles.histCellPartial
                  : styles.histCellFull;
            return (
              <div key={day.date} className={`${styles.histCell} ${cls}`} title={day.date}>
                <span className={styles.histDay} suppressHydrationWarning>
                  {mounted ? shortDay(day.date, locale) : ""}
                </span>
                <span className={styles.histCount}>{day.count}/{ITEMS.length}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.legend}>
          <span className={`${styles.legendDot} ${styles.histCellFull}`} />
          <span className={styles.legendLabel}>{t("ibadah.legendFull")}</span>
          <span className={`${styles.legendDot} ${styles.histCellPartial}`} />
          <span className={styles.legendLabel}>{t("ibadah.legendPartial")}</span>
          <span className={`${styles.legendDot} ${styles.histCellNone}`} />
          <span className={styles.legendLabel}>{t("ibadah.legendNone")}</span>
        </div>
      </section>
    </div>
  );
}
