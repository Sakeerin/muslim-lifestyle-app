"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { getMonthGrid, toHijri } from "@/lib/calendar-utils";
import styles from "./page.module.css";

type FastingRecord = {
  fastedDays: number[];
};

function storageKey(year: number, month: number) {
  return `fasting-${year}-${String(month).padStart(2, "0")}`;
}

// Sunnah fasting days: Mon (1), Thu (4), 13th-15th of Hijri month
function isSunnahDay(dayOfWeek: number, hijriDay: number): boolean {
  if (dayOfWeek === 1 || dayOfWeek === 4) return true;
  if (hijriDay >= 13 && hijriDay <= 15) return true;
  return false;
}

const DEFAULT_METHOD = 4; // Umm al-Qura

export default function FastingPage() {
  const { t, locale } = useI18n();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-based

  const key = storageKey(year, month);
  const [record, setRecord] = useLocalStorage<FastingRecord>(key, { fastedDays: [] });

  const { timings } = usePrayerTimes(DEFAULT_METHOD);

  const sahur = timings?.Fajr?.split(" ")[0] ?? "--:--";
  const iftar = timings?.Maghrib?.split(" ")[0] ?? "--:--";

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const hijriForMonth = useMemo(() => toHijri(new Date(year, month - 1, 15)), [year, month]);

  const monthLabel = useMemo(() => {
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
      month: "long",
      year: "numeric",
    });
  }, [year, month, locale]);

  const fastedCount = record.fastedDays.length;

  const toggleDay = (day: number) => {
    setRecord((prev) => {
      const days = prev.fastedDays;
      const updated = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
      return { fastedDays: updated };
    });
  };

  const prevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  const weekdays =
    locale === "th"
      ? ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1>{t("fasting.title")}</h1>
        <p>{t("fasting.subtitle")}</p>
      </section>

      {/* Sahur / Iftar today */}
      <section className={styles.timesCard}>
        <div className={styles.timeItem}>
          <Moon size={16} className={styles.timeIcon} />
          <div>
            <p className={styles.timeLabel}>{t("fasting.sahur")}</p>
            <p className={styles.timeValue} suppressHydrationWarning>
              {sahur}
            </p>
          </div>
        </div>
        <div className={styles.timeDivider} />
        <div className={styles.timeItem}>
          <span className={styles.sunIcon}>🌅</span>
          <div>
            <p className={styles.timeLabel}>{t("fasting.iftar")}</p>
            <p className={styles.timeValue} suppressHydrationWarning>
              {iftar}
            </p>
          </div>
        </div>
      </section>

      {/* Month navigator */}
      <div className={styles.navRow}>
        <button
          type="button"
          className={styles.navArrow}
          onClick={prevMonth}
          aria-label={t("calendar.prevMonth")}
        >
          <ChevronLeft size={16} />
        </button>
        <div className={styles.monthInfo}>
          <p className={styles.monthTitle}>{monthLabel}</p>
          <p className={styles.hijriLabel}>
            {locale === "th" ? hijriForMonth.monthNameTh : hijriForMonth.monthNameEn}{" "}
            {hijriForMonth.year} AH
          </p>
        </div>
        <button
          type="button"
          className={styles.navArrow}
          onClick={nextMonth}
          aria-label={t("calendar.nextMonth")}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <button type="button" className={styles.todayBtn} onClick={goToToday}>
        {t("calendar.today")}
      </button>

      {/* Stats */}
      <div className={styles.stats}>
        <span className={styles.statsCount}>
          {t("fasting.fastedDays", { count: String(fastedCount) })}
        </span>
      </div>

      {/* Calendar grid */}
      <div className={styles.grid}>
        {weekdays.map((d) => (
          <div key={d} className={styles.weekdayHeader}>
            {d}
          </div>
        ))}
        {grid.map((cell, i) => {
          const fasted = !cell.isOtherMonth && record.fastedDays.includes(cell.greg.day);
          const isToday = cell.isToday;
          const dayOfWeek = new Date(cell.greg.year, cell.greg.month - 1, cell.greg.day).getDay();
          const sunnah = !cell.isOtherMonth && isSunnahDay(dayOfWeek, cell.hijri.day);
          return (
            <button
              key={i}
              type="button"
              className={`${styles.cell}
                ${cell.isOtherMonth ? styles.cellOther : ""}
                ${isToday ? styles.cellToday : ""}
                ${fasted ? styles.cellFasted : ""}
                ${sunnah && !fasted ? styles.cellSunnah : ""}`}
              onClick={() => !cell.isOtherMonth && toggleDay(cell.greg.day)}
              disabled={cell.isOtherMonth}
              aria-pressed={fasted}
              aria-label={`${cell.greg.day} ${fasted ? t("fasting.fasted") : t("fasting.notFasted")}`}
            >
              <span className={isToday ? styles.todayCircle : styles.dayNum}>
                {cell.greg.day}
              </span>
              <span className={styles.hijriNum}>{cell.hijri.day}</span>
              {fasted && <span className={styles.fastedDot} />}
              {sunnah && !fasted && <span className={styles.sunnahDot} />}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendFasted}`} />
          {t("fasting.fasted")}
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendSunnah}`} />
          {t("fasting.sunnahDay")}
        </span>
      </div>

      <p className={styles.hint}>{t("fasting.tapHint")}</p>
    </div>
  );
}
