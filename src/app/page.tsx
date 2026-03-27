"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "next-themes";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { describeWeather, useWeather } from "@/hooks/use-weather";
import { toHijri } from "@/lib/calendar-utils";
import { useI18n } from "@/i18n/i18n-context";
import { WeatherDetailModal } from "@/components/features/weather-detail";
import styles from "./page.module.css";
import enDuasData from "./duas/en.json";
import thDuasData from "./duas/th.json";

const CALCULATION_METHODS: Array<{ value: number; label: string; shortLabel: string }> = [
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

export default function Home() {
  const [method, setMethod] = useLocalStorage("prayer-method", CALCULATION_METHODS[0]!.value);
  const [mounted, setMounted] = useState(false);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { countdown, date, error, loading, nextPrayer, location, timings } = usePrayerTimes(method);
  const weather = useWeather(
    location.coordinates.latitude,
    location.coordinates.longitude,
    !location.isLoading,
  );
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
    const mq = window.matchMedia("(max-width: 560px)");
    setIsMobile(mq.matches);
    const handle = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const currentPrayer = useMemo(() => {
    if (!timings) return null;
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let current: (typeof prayers)[number] | null = null;
    let currentTime = "";
    for (const p of prayers) {
      const raw = timings[p as keyof typeof timings] ?? "";
      const timeStr = raw.split(" ")[0];
      const [h, m] = timeStr.split(":").map(Number);
      if (h * 60 + m <= nowMins) {
        current = p;
        currentTime = timeStr;
      }
    }
    if (!current) {
      current = "Isha";
      currentTime = (timings["Isha"] ?? "").split(" ")[0];
    }
    return { name: current, time: currentTime };
  }, [timings]);

  const nextPrayerData = useMemo(() => {
    if (!timings) return null;
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    for (const p of prayers) {
      const raw = timings[p as keyof typeof timings] ?? "";
      const timeStr = raw.split(" ")[0];
      const [h, m] = timeStr.split(":").map(Number);
      if (h * 60 + m > nowMins) {
        return { name: p, time: timeStr };
      }
    }
    return { name: "Fajr" as const, time: (timings["Fajr"] ?? "").split(" ")[0] };
  }, [timings]);

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
          <div className={styles.dateMethodRow}>
            <p
              suppressHydrationWarning
              className={mounted && resolvedTheme === "light" ? styles.textWhite : ""}
            >
              {date ?? t("home.todaySchedule")}
            </p>
            <label>
              {t("home.method")}
              <select
                suppressHydrationWarning
                value={method}
                onChange={(event) => {
                  setMethod(Number(event.target.value));
                }}
              >
                {CALCULATION_METHODS.map((option) => (
                  <option
                    suppressHydrationWarning
                    key={option.value}
                    value={option.value}
                  >
                    {isMobile ? option.shortLabel : option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.hijriRow}>
            <p className={styles.hijriDate} suppressHydrationWarning>
              ☪ {mounted ? hijriLabel : ""}
            </p>
            <p suppressHydrationWarning className={styles.hijriCountdown}>
              {loading ? "--:--:--" : (countdown ?? "--:--:--")}
            </p>
          </div>
          <div className={styles.prayerStatusRow}>
            {currentPrayer && (
              <div className={styles.prayerCard}>
                <div className={styles.prayerCardTop}>
                  <span className={styles.currentBadge}>
                    <span className={styles.dot} />
                    {t("home.now")}
                  </span>
                  <span className={styles.prayerCardName}>
                    {t(`prayer.${currentPrayer.name}`)}
                  </span>
                </div>
                <p className={styles.prayerCardTime}>{currentPrayer.time}</p>
              </div>
            )}
            <div className={styles.prayerCard}>
              <div className={styles.prayerCardTop}>
                <span className={styles.nextBadge}>{t("home.next")}</span>
                <span className={styles.prayerCardName}>
                  {nextPrayerData ? t(`prayer.${nextPrayerData.name}`) : (nextPrayer ?? t("home.loading"))}
                </span>
              </div>
              <p suppressHydrationWarning className={styles.prayerCardTime}>
                {loading ? "--:--" : (nextPrayerData?.time ?? "--:--")}
              </p>
            </div>
            {!weather.loading && weather.temperature !== null && weather.weatherCode !== null && (
              <button
                className={styles.weather}
                onClick={() => setShowWeatherDetail(true)}
                aria-label="View weather details"
              >
                <span className={styles.weatherIcon}>
                  {describeWeather(weather.weatherCode).icon}
                </span>
                <div>
                  <p className={styles.weatherTemp}>{weather.temperature}°C</p>
                  <p className={styles.weatherDesc}>
                    {locale === "th"
                      ? describeWeather(weather.weatherCode).labelTh
                      : describeWeather(weather.weatherCode).labelEn}
                  </p>
                  {weather.humidity !== null && (
                    <p className={styles.weatherHumidity}>💧 {weather.humidity}%</p>
                  )}
                </div>
              </button>
            )}
            <Link href="/donate" className={styles.donationWidget}>
              <span className={styles.donationIcon}>🤲</span>
              <div>
                <p className={styles.donationTitle}>{t("home.donateTitle")}</p>
                <p className={styles.donateCta}>{t("home.donateCta")}</p>
              </div>
            </Link>
          </div>
        </div>
        {error ? <p className={styles.warning}>{error}</p> : null}
      </section>

      <WeatherDetailModal
        open={showWeatherDetail}
        onClose={() => setShowWeatherDetail(false)}
        temperature={weather.temperature}
        weatherCode={weather.weatherCode}
        humidity={weather.humidity}
        lat={location.coordinates.latitude}
        lng={location.coordinates.longitude}
        locationName={location.cityName ?? ""}
      />

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
