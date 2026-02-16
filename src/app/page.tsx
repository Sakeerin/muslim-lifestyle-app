"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import styles from "./page.module.css";

const CALCULATION_METHODS: Array<{ value: number; label: string }> = [
  { value: 2, label: "ISNA" },
  { value: 3, label: "MWL" },
  { value: 5, label: "Egypt" },
];

const DAILY_WIDGETS = [
  {
    title: "Daily Ayah",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Surely with hardship comes ease. (Qur'an 94:6)",
  },
  {
    title: "Daily Dua",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge. (Qur'an 20:114)",
  },
];

export default function Home() {
  const [method, setMethod] = useState(2);
  const { countdown, date, error, loading, nextPrayer } = usePrayerTimes(method);
  const dailyContent = useMemo(
    () => DAILY_WIDGETS[new Date().getDate() % DAILY_WIDGETS.length],
    [],
  );

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <div>
            <p>{date ?? "Today's Schedule"}</p>
            <h1>Next prayer: {nextPrayer ?? "Loading"}</h1>
            <p className={styles.countdown}>{loading ? "--:--:--" : countdown}</p>
          </div>
          <label>
            Method
            <select value={method} onChange={(event) => setMethod(Number(event.target.value))}>
              {CALCULATION_METHODS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error ? <p className={styles.warning}>{error}</p> : null}
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>{dailyContent.title}</h2>
          <p className={styles.arabic}>{dailyContent.arabic}</p>
          <p>{dailyContent.translation}</p>
        </article>

        <article className={styles.card}>
          <h2>Quick Access</h2>
          <div className={styles.quickGrid}>
            <Link className={styles.quickLink} href="/prayer-times">
              Prayer Times
            </Link>
            <Link className={styles.quickLink} href="/quran">
              Quran Reader
            </Link>
            <Link className={styles.quickLink} href="/qibla">
              Qibla Compass
            </Link>
            <Link className={styles.quickLink} href="/settings">
              App Settings
            </Link>
          </div>
        </article>
      </section>

      <section className={styles.card}>
        <h2>Today&apos;s intention</h2>
        <p>
          Begin with two minutes of reflection, then open Quran mode to continue your recitation
          where you left off.
        </p>
      </section>
    </div>
  );
}
