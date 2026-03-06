"use client";

import { useMemo, useRef, useState } from "react";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { PRAYER_ORDER } from "@/lib/prayer-utils";
import { useI18n } from "@/i18n/i18n-context";
import { Printer } from "lucide-react";
import styles from "./page.module.css";

const ADHAN_URL = "https://download.quranicaudio.com/quran/adhan/azan1.mp3";

const METHODS: Array<{ value: number; label: string }> = [
  { value: 2, label: "ISNA" },
  { value: 3, label: "MWL" },
  { value: 5, label: "Egypt" },
  { value: 4, label: "Umm al-Qura" },
];

export default function PrayerTimesPage() {
  const [method, setMethod] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { countdown, date, error, loading, location, monthly, nextPrayer, timings } =
    usePrayerTimes(method);
  const { t } = useI18n();

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
          <p>{locationLabel}</p>
        </div>
        <label>
          {t("prayerTimes.calculation")}
          <select value={method} onChange={(event) => setMethod(Number(event.target.value))}>
            {METHODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
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
              {monthly.map((day) => (
                <tr key={`${day.day}-${day.weekday}`}>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
