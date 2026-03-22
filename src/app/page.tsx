"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { toHijri } from "@/lib/calendar-utils";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";
import enDuasData from "./duas/en.json";
import thDuasData from "./duas/th.json";

const CALCULATION_METHODS: Array<{ value: number; label: string }> = [
  { value: 2, label: "ISNA" },
  { value: 3, label: "MWL" },
  { value: 5, label: "Egypt" },
];

export default function Home() {
  const [method, setMethod] = useState(2);
  const [mounted, setMounted] = useState(false);
  const { countdown, date, error, loading, nextPrayer } = usePrayerTimes(method);
  const { t, locale } = useI18n();
  const { resolvedTheme } = useTheme();

  const hijriLabel = useMemo(() => {
    const h = toHijri(new Date());
    const monthName = locale === "th" ? h.monthNameTh : h.monthNameEn;
    return t("home.hijriDate", { day: String(h.day), month: monthName, year: String(h.year) });
  }, [locale, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const dailyPool = useMemo(() => {
    const data = locale === "th" ? thDuasData : enDuasData;
    return data.map((d) => ({
      category: d.source?.startsWith("QS.") ? ("ayah" as const) : ("dua" as const),
      arabic: d.arabic,
      translation: d.translation,
      source: d.source ?? "",
    }));
  }, [locale]);

  const dailyContent = useMemo(() => {
    const item = dailyPool[new Date().getDate() % dailyPool.length];
    return {
      title: item.category === "ayah" ? t("home.dailyAyah") : t("home.dailyDua"),
      arabic: item.arabic,
      translation: item.translation,
      source: item.source,
    };
  }, [dailyPool, t]);

  const fallbackContent = useMemo(() => {
    const item = enDuasData[0];
    return {
      title: t("home.dailyDua"),
      arabic: item.arabic,
      translation: item.translation,
    };
  }, [t]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Muslim Lifestyle App",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://muslim-lifestyle-app.vercel.app",
    description:
      "A comprehensive Muslim lifestyle app featuring accurate prayer times, the Holy Quran, Qibla compass, daily duas, and a halal places finder.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "https://muslim-lifestyle-app.vercel.app"}/quran?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className={styles.dashboard}>
      {mounted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <div>
            <p
              suppressHydrationWarning
              className={mounted && resolvedTheme === "light" ? styles.textWhite : ""}
            >
              {date ?? t("home.todaySchedule")}
            </p>
            <p className={styles.hijriDate} suppressHydrationWarning>
              ☪ {mounted ? hijriLabel : ""}
            </p>
            <h1>{t("home.nextPrayer", { name: nextPrayer ?? t("home.loading") })}</h1>
            <p
              suppressHydrationWarning
              className={`${styles.countdown} ${mounted && resolvedTheme === "light" ? styles.textWhite : ""}`.trim()}
            >
              {loading ? "--:--:--" : countdown}
            </p>
          </div>
          <label>
            {t("home.method")}
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
          <h2>{mounted ? dailyContent.title : fallbackContent.title}</h2>
          <p className={styles.arabic}>{mounted ? dailyContent.arabic : fallbackContent.arabic}</p>
          <p>{mounted ? dailyContent.translation : fallbackContent.translation}</p>
        </article>

        <article className={styles.card}>
          <h2>{t("home.quickAccess")}</h2>
          <div className={styles.quickGrid}>
            <Link className={styles.quickLink} href="/calendar">
              {t("home.islamicCalendar")}
            </Link>
            <Link className={styles.quickLink} href="/zakat">
              {t("home.zakatCalculator")}
            </Link>
            <Link className={styles.quickLink} href="/prayer-times">
              {t("home.prayerTimes")}
            </Link>
            <Link className={styles.quickLink} href="/quran">
              {t("home.quranReader")}
            </Link>
            <Link className={styles.quickLink} href="/qibla">
              {t("home.qiblaCompass")}
            </Link>
            <Link className={styles.quickLink} href="/lessons">
              {t("home.islamicLessons")}
            </Link>
            <Link className={styles.quickLink} href="/duas">
              {t("home.duas")}
            </Link>
            <Link className={styles.quickLink} href="/places">
              {t("home.halalPlaces")}
            </Link>
            <Link className={styles.quickLink} href="/settings">
              {t("home.appSettings")}
            </Link>
          </div>
        </article>
      </section>

      <section className={styles.card}>
        <h2>{t("home.todayIntention")}</h2>
        <p>{t("home.intentionBody")}</p>
      </section>
    </div>
  );
}
