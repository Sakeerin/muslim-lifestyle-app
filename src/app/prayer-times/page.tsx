"use client";

import { useMemo, useRef, useState } from "react";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { PRAYER_ORDER } from "@/lib/prayer-utils";
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

  const locationLabel = useMemo(() => {
    if (location.source === "gps") {
      return "Using precise GPS";
    }

    if (location.source === "ip") {
      return "Using IP fallback";
    }

    return "Using default Makkah location";
  }, [location.source]);

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

    void audio.play();
    setIsPlaying(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div>
          <h1>Prayer Times</h1>
          <p>{date ?? "Fetching schedule..."}</p>
          <p>{locationLabel}</p>
        </div>
        <label>
          Calculation
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
        <h2>Next: {nextPrayer ?? "-"}</h2>
        <p>{loading ? "--:--:--" : countdown}</p>
        {error ? <p>{error}</p> : null}
      </section>

      <section className={styles.card}>
        <h2>Today&apos;s prayers</h2>
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
        <h2>Azan player</h2>
        <div className={styles.controls}>
          <button type="button" onClick={toggleAudio}>
            {isPlaying ? "Pause Azan" : "Play Azan"}
          </button>
        </div>
        <audio ref={audioRef} src={ADHAN_URL} onEnded={() => setIsPlaying(false)} preload="none" />
      </section>

      <section className={styles.card}>
        <h2>Monthly schedule</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Hijri</th>
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
