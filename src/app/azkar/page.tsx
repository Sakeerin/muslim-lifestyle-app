"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { AZKAR } from "./data";
import styles from "./page.module.css";

type Session = "morning" | "evening";

type AzkarProgress = {
  date: string;
  counts: Record<string, number>;
};

const STORAGE_KEY = "azkar-progress";

function todayDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function freshProgress(): AzkarProgress {
  return { date: todayDate(), counts: {} };
}

export default function AzkarPage() {
  const { t, locale } = useI18n();
  const [session, setSession] = useState<Session>("morning");
  const [stored, setStored] = useLocalStorage<AzkarProgress>(STORAGE_KEY, freshProgress());

  // Daily reset — if stored date differs from today, reset counts
  const progress = useMemo<AzkarProgress>(() => {
    if (stored.date !== todayDate()) return freshProgress();
    return stored;
  }, [stored]);

  const items = useMemo(() => AZKAR.filter((a) => a.session === session), [session]);

  const completedCount = useMemo(
    () => items.filter((a) => (progress.counts[a.id] ?? 0) >= a.count).length,
    [items, progress],
  );

  const allDone = completedCount === items.length;

  const tap = (id: string, required: number) => {
    const current = progress.counts[id] ?? 0;
    if (current >= required) return; // already completed
    const updated: AzkarProgress = {
      date: todayDate(),
      counts: { ...progress.counts, [id]: current + 1 },
    };
    setStored(updated);
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1>{t("azkar.title")}</h1>
        <p>{t("azkar.subtitle")}</p>
      </section>

      {/* Session toggle */}
      <div className={styles.toggle}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${session === "morning" ? styles.toggleBtnActive : ""}`}
          onClick={() => setSession("morning")}
        >
          {t("azkar.morning")}
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${session === "evening" ? styles.toggleBtnActive : ""}`}
          onClick={() => setSession("evening")}
        >
          {t("azkar.evening")}
        </button>
      </div>

      {/* Progress summary */}
      <div className={styles.summary}>
        <div className={styles.summaryBar}>
          <div
            className={styles.summaryFill}
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>
        <p className={styles.summaryLabel}>
          {allDone ? (
            <span className={styles.summaryDone}>
              <CheckCircle2 size={14} />
              {t("azkar.allDone")}
            </span>
          ) : (
            t("azkar.progress", {
              done: String(completedCount),
              total: String(items.length),
            })
          )}
        </p>
      </div>

      {/* Azkar list */}
      <section className={styles.list}>
        {items.map((item) => {
          const done = (progress.counts[item.id] ?? 0) >= item.count;
          const current = progress.counts[item.id] ?? 0;
          return (
            <article
              key={item.id}
              className={`${styles.card} ${done ? styles.cardDone : ""}`}
              onClick={() => tap(item.id, item.count)}
              role="button"
              tabIndex={0}
              aria-pressed={done}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  tap(item.id, item.count);
                }
              }}
            >
              <div className={styles.cardTop}>
                <span className={styles.countBadge}>
                  {current}/{item.count}×
                </span>
                {done && (
                  <span className={styles.doneBadge}>
                    <CheckCircle2 size={13} />
                    {t("azkar.done")}
                  </span>
                )}
              </div>
              <p className={styles.arabic}>{item.arabic}</p>
              <p className={styles.translit}>{item.transliterationEn}</p>
              <p className={styles.translation}>
                {locale === "th" ? item.translationTh : item.translationEn}
              </p>
              <p className={styles.source}>{item.source}</p>
              {(locale === "th" ? item.notesTh : item.notesEn) && (
                <p className={styles.notes}>
                  {locale === "th" ? item.notesTh : item.notesEn}
                </p>
              )}
              <details
                className={styles.benefitsDetails}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <summary className={styles.benefitsSummary}>
                  {t("azkar.benefits")}
                </summary>
                <p className={styles.benefitsText}>
                  {locale === "th" ? item.benefitsTh : item.benefitsEn}
                </p>
              </details>
            </article>
          );
        })}
      </section>
    </div>
  );
}
