"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getMonthGrid,
  getHijriMonthGrid,
  getEventsForMonth,
  getTodayHijri,
  toHijri,
} from "@/lib/calendar-utils";
import type { CalendarMode } from "@/lib/calendar-utils";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const GREG_MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const GREG_MONTHS_TH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export default function CalendarPage() {
  const { t, locale } = useI18n();
  const [mode, setMode] = useState<CalendarMode>("gregorian");

  // Gregorian navigation state
  const today = new Date();
  const [gregYear, setGregYear] = useState(today.getFullYear());
  const [gregMonth, setGregMonth] = useState(today.getMonth() + 1);

  // Hijri navigation state
  const todayHijri = getTodayHijri();
  const [hijriYear, setHijriYear] = useState(todayHijri.year);
  const [hijriMonth, setHijriMonth] = useState(todayHijri.month);

  const isEn = locale === "en";
  const weekdays = isEn ? WEEKDAYS_EN : WEEKDAYS_TH;

  // ------------------------------------------------------------------
  // Grid data
  // ------------------------------------------------------------------
  const gregGrid = useMemo(() => getMonthGrid(gregYear, gregMonth), [gregYear, gregMonth]);
  const hijriGrid = useMemo(
    () => getHijriMonthGrid(hijriYear, hijriMonth),
    [hijriYear, hijriMonth],
  );
  const grid = mode === "gregorian" ? gregGrid : hijriGrid;

  // ------------------------------------------------------------------
  // Events list for the month
  // ------------------------------------------------------------------
  const events = useMemo(() => {
    if (mode === "gregorian") {
      return getEventsForMonth(gregYear, gregMonth);
    }
    // Collect events for all Gregorian days in this Hijri month
    const seen = new Set<string>();
    const result = hijriGrid
      .filter((c) => !c.isOtherMonth)
      .flatMap((c) => c.events)
      .filter((ev) => {
        if (seen.has(ev.key)) return false;
        seen.add(ev.key);
        return true;
      });
    return result;
  }, [mode, gregYear, gregMonth, hijriGrid]);

  // ------------------------------------------------------------------
  // Month title helpers
  // ------------------------------------------------------------------
  function gregMonthLabel() {
    const name = isEn
      ? (GREG_MONTHS_EN[gregMonth - 1] ?? "")
      : (GREG_MONTHS_TH[gregMonth - 1] ?? "");
    const year = isEn ? gregYear : gregYear + 543; // Buddhist Era
    return { name, year };
  }

  function hijriMonthLabel() {
    const sampleCell = hijriGrid.find((c) => !c.isOtherMonth);
    const name = isEn
      ? (sampleCell?.hijri.monthNameEn ?? "")
      : (sampleCell?.hijri.monthNameTh ?? "");
    return { name, year: hijriYear };
  }

  // ------------------------------------------------------------------
  // Navigation handlers
  // ------------------------------------------------------------------
  function prevMonth() {
    if (mode === "gregorian") {
      if (gregMonth === 1) {
        setGregYear((y) => y - 1);
        setGregMonth(12);
      } else {
        setGregMonth((m) => m - 1);
      }
    } else {
      if (hijriMonth === 1) {
        setHijriYear((y) => y - 1);
        setHijriMonth(12);
      } else {
        setHijriMonth((m) => m - 1);
      }
    }
  }

  function nextMonth() {
    if (mode === "gregorian") {
      if (gregMonth === 12) {
        setGregYear((y) => y + 1);
        setGregMonth(1);
      } else {
        setGregMonth((m) => m + 1);
      }
    } else {
      if (hijriMonth === 12) {
        setHijriYear((y) => y + 1);
        setHijriMonth(1);
      } else {
        setHijriMonth((m) => m + 1);
      }
    }
  }

  function goToToday() {
    setGregYear(today.getFullYear());
    setGregMonth(today.getMonth() + 1);
    const h = getTodayHijri();
    setHijriYear(h.year);
    setHijriMonth(h.month);
  }

  // ------------------------------------------------------------------
  // Secondary label for each cell
  // ------------------------------------------------------------------
  function cellSecondaryLabel(cell: (typeof grid)[0]) {
    if (mode === "gregorian") {
      // Show Hijri day + month name (abbreviated)
      const h = cell.hijri;
      const monthName = isEn ? h.monthNameEn.split(" ")[0] : h.monthNameTh;
      return `${h.day} ${h.day === 1 ? monthName : ""}`;
    } else {
      // Show Gregorian date
      return `${cell.greg.day}/${cell.greg.month}`;
    }
  }

  // ------------------------------------------------------------------
  // Month header info
  // ------------------------------------------------------------------
  const { name: primaryMonthName, year: primaryYear } =
    mode === "gregorian" ? gregMonthLabel() : hijriMonthLabel();

  // Inverse subtitle
  function getSubtitle() {
    if (mode === "gregorian") {
      // Show current Hijri month range in the Gregorian month
      const firstCell = gregGrid.find((c) => !c.isOtherMonth);
      const lastCell = [...gregGrid].reverse().find((c) => !c.isOtherMonth);
      if (!firstCell || !lastCell) return "";
      const h1 = firstCell.hijri;
      const h2 = lastCell.hijri;
      const m1 = isEn ? h1.monthNameEn : h1.monthNameTh;
      const m2 = isEn ? h2.monthNameEn : h2.monthNameTh;
      if (h1.month === h2.month) return `${m1} ${h1.year} AH`;
      return `${m1} – ${m2} ${h2.year} AH`;
    } else {
      // Show Gregorian month range
      const firstCell = hijriGrid.find((c) => !c.isOtherMonth);
      const lastCell = [...hijriGrid].reverse().find((c) => !c.isOtherMonth);
      if (!firstCell || !lastCell) return "";
      const m1 = isEn
        ? (GREG_MONTHS_EN[firstCell.greg.month - 1] ?? "")
        : (GREG_MONTHS_TH[firstCell.greg.month - 1] ?? "");
      const m2 = isEn
        ? (GREG_MONTHS_EN[lastCell.greg.month - 1] ?? "")
        : (GREG_MONTHS_TH[lastCell.greg.month - 1] ?? "");
      const yr = isEn ? lastCell.greg.year : lastCell.greg.year + 543;
      if (firstCell.greg.month === lastCell.greg.month) return `${m1} ${yr}`;
      return `${m1} – ${m2} ${yr}`;
    }
  }

  // Also show today's Hijri date in header
  const todayHijriLabel = useMemo(() => {
    const h = toHijri(new Date());
    return isEn
      ? `${h.day} ${h.monthNameEn} ${h.year} AH`
      : `${h.day} ${h.monthNameTh} ${h.year} ฮ.ศ.`;
  }, [isEn]);

  return (
    <div className={styles.page}>
      {/* ---- Header ---- */}
      <section className={styles.header}>
        <h1>{t("calendar.title")}</h1>
        <p>{todayHijriLabel}</p>
      </section>

      {/* ---- Mode toggle ---- */}
      <div className={styles.modeToggle}>
        <button
          id="calendar-mode-gregorian"
          type="button"
          className={`${styles.modeBtn} ${mode === "gregorian" ? styles.modeBtnActive : ""}`}
          onClick={() => setMode("gregorian")}
        >
          🌍 {t("calendar.gregorian")}
        </button>
        <button
          id="calendar-mode-hijri"
          type="button"
          className={`${styles.modeBtn} ${mode === "hijri" ? styles.modeBtnActive : ""}`}
          onClick={() => setMode("hijri")}
        >
          🌙 {t("calendar.hijri")}
        </button>
      </div>

      {/* ---- Month navigation ---- */}
      <div className={styles.navRow}>
        <button
          id="calendar-prev-month"
          type="button"
          className={styles.navArrow}
          onClick={prevMonth}
          aria-label={t("calendar.prevMonth")}
        >
          <ChevronLeft size={16} />
        </button>

        <div className={styles.monthTitle}>
          {primaryMonthName} {primaryYear}
          <span className={styles.monthSubtitle}>{getSubtitle()}</span>
        </div>

        <button
          id="calendar-next-month"
          type="button"
          className={styles.navArrow}
          onClick={nextMonth}
          aria-label={t("calendar.nextMonth")}
        >
          <ChevronRight size={16} />
        </button>

        <button id="calendar-today" type="button" className={styles.todayBtn} onClick={goToToday}>
          {t("calendar.today")}
        </button>
      </div>

      {/* ---- Calendar grid ---- */}
      <div className={styles.grid}>
        {/* Weekday headers */}
        {weekdays.map((wd) => (
          <div key={wd} className={styles.weekdayHeader}>
            {wd}
          </div>
        ))}

        {/* Day cells */}
        {grid.map((cell, idx) => {
          const primaryNum = mode === "gregorian" ? cell.greg.day : cell.hijri.day;
          const secondaryLabel = cellSecondaryLabel(cell);
          const islamicDots = cell.events.filter((e) => e.category === "islamic");
          const intlDots = cell.events.filter((e) => e.category === "international");

          return (
            <div
              key={`${idx}-${cell.greg.year}-${cell.greg.month}-${cell.greg.day}`}
              className={[
                styles.cell,
                cell.isOtherMonth ? styles.cellOther : "",
                cell.isToday ? styles.cellToday : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {cell.isToday ? (
                <span className={styles.todayCircle}>{primaryNum}</span>
              ) : (
                <span className={styles.dayNum}>{primaryNum}</span>
              )}
              <span className={styles.hijriNum}>{secondaryLabel}</span>
              {(islamicDots.length > 0 || intlDots.length > 0) && (
                <div className={styles.dots}>
                  {islamicDots.map((e) => (
                    <span key={e.key} className={`${styles.dot} ${styles.dotIslamic}`} />
                  ))}
                  {intlDots.map((e) => (
                    <span key={e.key} className={`${styles.dot} ${styles.dotInternational}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---- Events list ---- */}
      <section className={styles.eventsSection}>
        <h2 className={styles.eventsTitle}>{t("calendar.events")}</h2>

        {events.length === 0 ? (
          <p className={styles.noEvents}>{t("calendar.noEvents")}</p>
        ) : (
          <div className={styles.eventList}>
            {events
              .slice()
              .sort((a, b) => {
                // Sort chronologically; overflow events (next month) come after current month
                const baseMonth = mode === "gregorian" ? gregMonth : 0;
                const aVal = (a.gregMonth - baseMonth) * 100 + a.gregDay;
                const bVal = (b.gregMonth - baseMonth) * 100 + b.gregDay;
                return aVal - bVal;
              })
              .map((ev) => {
                const isIslamic = ev.category === "islamic";
                const dateLabel =
                  mode === "gregorian"
                    ? isEn
                      ? `${GREG_MONTHS_EN[ev.gregMonth - 1] ?? ""} ${ev.gregDay}`
                      : `${ev.gregDay} ${GREG_MONTHS_TH[ev.gregMonth - 1] ?? ""}`
                    : ev.gregDay > 0
                      ? `${ev.gregDay}/${ev.gregMonth}`
                      : "";

                return (
                  <div key={ev.key} className={styles.eventItem}>
                    <span
                      className={`${styles.eventBadge} ${isIslamic ? styles.badgeIslamic : styles.badgeInternational}`}
                    >
                      {isIslamic ? "🌙" : "🌍"}{" "}
                      {isIslamic ? t("calendar.islamic") : t("calendar.international")}
                    </span>
                    <div>
                      <p className={styles.eventName}>{isEn ? ev.nameEn : ev.nameTh}</p>
                      <p className={styles.eventDate}>{dateLabel}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
