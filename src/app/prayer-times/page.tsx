"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { toHijri } from "@/lib/calendar-utils";
import { PRAYER_ORDER } from "@/lib/prayer-utils";
import { useI18n } from "@/i18n/i18n-context";
import { ChevronDown, MapPin, Printer } from "lucide-react";
import styles from "./page.module.css";

const ADHAN_URL = "https://download.quranicaudio.com/quran/adhan/azan1.mp3";

const METHODS: Array<{ value: number; label: string; shortLabel: string }> = [
  { value: 4, label: "อุมม์ อัลกุรอ์ — มักกะห์", shortLabel: "อุมม์ อัลกุรอ์" },
  { value: 3, label: "MWL — สันนิบาตมุสลิมโลก", shortLabel: "MWL" },
  { value: 5, label: "อียิปต์", shortLabel: "อียิปต์" },
  { value: 16, label: "JAKIM — มาเลเซีย", shortLabel: "JAKIM" },
  { value: 20, label: "KEMENAG — อินโดนีเซีย", shortLabel: "KEMENAG" },
  { value: 12, label: "Diyanet — ตุรกี", shortLabel: "Diyanet" },
  { value: 8, label: "คูเวต", shortLabel: "คูเวต" },
  { value: 1, label: "การาจี — ปากีสถาน", shortLabel: "การาจี" },
  { value: 2, label: "ISNA — อเมริกา/แคนาดา", shortLabel: "ISNA" },
];

export default function PrayerTimesPage() {
  const [method, setMethod] = useLocalStorage("prayer-method", METHODS[0]!.value);
  const [isPlaying, setIsPlaying] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const methodWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (methodWrapRef.current && !methodWrapRef.current.contains(e.target as Node)) {
        setMethodOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  const { countdown, date, error, loading, location, monthly, nextPrayer, timings } =
    usePrayerTimes(method);
  const { t, locale } = useI18n();

  const hijriLabel = useMemo(() => {
    const h = toHijri(new Date());
    const monthName = locale === "th" ? h.monthNameTh : h.monthNameEn;
    return t("home.hijriDate", { day: String(h.day), month: monthName, year: String(h.year) });
  }, [locale, t]);

  const locationLabel = useMemo(() => {
    if (location.source === "gps") {
      return t("prayerTimes.gps");
    }

    if (location.source === "ip") {
      return t("prayerTimes.ip");
    }

    return t("prayerTimes.default");
  }, [location.source, t]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setIsPlaying(false);
      });
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div>
          <h1>{t("prayerTimes.title")}</h1>
          <p>{date ?? t("prayerTimes.fetchingSchedule")}</p>
          <p className={styles.hijriDate} suppressHydrationWarning>
            ☪ {hijriLabel}
          </p>
          <p className={styles.locationName} suppressHydrationWarning>
            <MapPin size={13} />
            {location.cityName ?? locationLabel}
          </p>
        </div>
        <div ref={methodWrapRef} className={styles.methodWrap}>
          <span className={styles.methodLabel}>{t("prayerTimes.calculation")}</span>
          <button
            type="button"
            className={styles.methodBtn}
            onClick={() => setMethodOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={methodOpen}
          >
            <span>{METHODS.find((m) => m.value === method)?.shortLabel}</span>
            <ChevronDown size={14} className={methodOpen ? styles.chevronOpen : styles.chevronIcon} />
          </button>
          {methodOpen && (
            <ul role="listbox" className={styles.methodDropdown}>
              {METHODS.map((item) => (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={item.value === method}
                  title={item.label}
                  className={`${styles.methodOption} ${item.value === method ? styles.methodOptionActive : ""}`}
                  onClick={() => {
                    setMethod(item.value);
                    setMethodOpen(false);
                  }}
                >
                  {item.shortLabel}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h2>{t("prayerTimes.next", { name: nextPrayer ?? "-" })}</h2>
        <p>{loading ? "--:--:--" : countdown}</p>
        {error ? <p>{error}</p> : null}
      </section>

      <section className={styles.card}>
        <h2>{t("prayerTimes.todayPrayers")}</h2>
        <div className={styles.timings}>
          {PRAYER_ORDER.map((prayer) => (
            <article
              key={prayer}
              className={`${styles.timing} ${nextPrayer === prayer ? styles.active : ""}`}
            >
              <strong>{prayer}</strong>
              <p>{timings?.[prayer] ?? "--:--"}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <h2>{t("prayerTimes.azanPlayer")}</h2>
        <div className={styles.controls}>
          <button type="button" onClick={toggleAudio}>
            {isPlaying ? t("prayerTimes.pauseAzan") : t("prayerTimes.playAzan")}
          </button>
        </div>
        <audio ref={audioRef} src={ADHAN_URL} onEnded={() => setIsPlaying(false)} preload="none" />
      </section>

      <section className={styles.card}>
        <div className={styles.monthlyHeader}>
          <h2>{t("prayerTimes.monthlySchedule")}</h2>
          <button type="button" onClick={() => window.print()} className={styles.printButton}>
            <Printer size={16} />
            <span>{t("prayerTimes.printSchedule")}</span>
          </button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("prayerTimes.date")}</th>
                <th>{t("prayerTimes.hijri")}</th>
                <th>Fajr</th>
                <th>Dhuhr</th>
                <th>Asr</th>
                <th>Maghrib</th>
                <th>Isha</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((day) => {
                const isToday = Number(day.day) === new Date().getDate();
                return (
                  <tr
                    key={`${day.day}-${day.weekday}`}
                    className={isToday ? styles.currentDayRow : ""}
                  >
                    <td>
                      {day.day} {day.weekday}
                    </td>
                    <td>{day.hijri}</td>
                    <td>{day.timings.Fajr}</td>
                    <td>{day.timings.Dhuhr}</td>
                    <td>{day.timings.Asr}</td>
                    <td>{day.timings.Maghrib}</td>
                    <td>{day.timings.Isha}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
