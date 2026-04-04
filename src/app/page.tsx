"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Grid3X3, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "next-themes";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { describeWeather, useWeather } from "@/hooks/use-weather";
import { toHijri, getUpcomingIslamicEvents } from "@/lib/calendar-utils";
import { useI18n } from "@/i18n/i18n-context";
import { WeatherDetailModal } from "@/components/features/weather-detail";
import styles from "./page.module.css";
import enDuasData from "./duas/en.json";
import thDuasData from "./duas/th.json";
import { getDailyHadith } from "@/data/hadith";

const QUICK_LINKS = [
  {
    href: "/prayer-times",
    labelKey: "home.prayerTimes",
    icon: "🕌",
    category: "worship",
    pinned: false,
  },
  {
    href: "/qibla",
    labelKey: "home.qiblaCompass",
    icon: "🧭",
    category: "worship",
    pinned: false,
  },
  {
    href: "/quran",
    labelKey: "home.quranReader",
    icon: "📖",
    category: "knowledge",
    pinned: false,
  },
  { href: "/duas", labelKey: "home.duas", icon: "🤲", category: "knowledge", pinned: true },
  {
    href: "/lessons",
    labelKey: "home.islamicLessons",
    icon: "📚",
    category: "knowledge",
    pinned: false,
  },
  {
    href: "/calendar",
    labelKey: "home.islamicCalendar",
    icon: "📅",
    category: "tools",
    pinned: true,
  },
  {
    href: "/zakat",
    labelKey: "home.zakatCalculator",
    icon: "⚖️",
    category: "tools",
    pinned: false,
  },
  {
    href: "/places",
    labelKey: "home.halalPlaces",
    icon: "📍",
    category: "tools",
    pinned: true,
  },
  {
    href: "/settings",
    labelKey: "home.appSettings",
    icon: "⚙️",
    category: "settings",
    pinned: false,
  },
  {
    href: "/names",
    labelKey: "home.allahNames",
    icon: "✨",
    category: "knowledge",
    pinned: false,
  },
  {
    href: "/hajj-umrah",
    labelKey: "home.hajjUmrah",
    icon: "🕋",
    category: "knowledge",
    pinned: true,
  },
  {
    href: "/tasbeeh",
    labelKey: "home.tasbeeh",
    icon: "📿",
    category: "worship",
    pinned: false,
  },
  {
    href: "/azkar",
    labelKey: "home.azkar",
    icon: "🌅",
    category: "worship",
    pinned: false,
  },
  {
    href: "/fasting",
    labelKey: "home.fasting",
    icon: "🌙",
    category: "worship",
    pinned: false,
  },
  {
    href: "/prayer-streak",
    labelKey: "home.prayerStreak",
    icon: "🔥",
    category: "worship",
    pinned: false,
  },
  {
    href: "/ibadah",
    labelKey: "home.ibadahChecklist",
    icon: "☑️",
    category: "worship",
    pinned: false,
  },
  {
    href: "/duas/journal",
    labelKey: "home.duaJournal",
    icon: "📝",
    category: "knowledge",
    pinned: false,
  },
  {
    href: "/stats",
    labelKey: "home.stats",
    icon: "📊",
    category: "tools",
    pinned: false,
  },
] as const;

const QUICK_LINK_CATEGORIES = [
  { id: "worship", labelKey: "home.categoryWorship" },
  { id: "knowledge", labelKey: "home.categoryKnowledge" },
  { id: "tools", labelKey: "home.categoryTools" },
  { id: "settings", labelKey: "home.categorySettings" },
] as const;

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
  const [showMore, setShowMore] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const methodWrapRef = useRef<HTMLDivElement>(null);
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
    const handleOutside = (e: MouseEvent) => {
      if (methodWrapRef.current && !methodWrapRef.current.contains(e.target as Node)) {
        setMethodOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMore]);

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
    const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

    const next = prayers.find((prayer) => {
      const raw = timings[prayer] ?? "";
      const [h, m] = raw.split(" ")[0].split(":").map(Number);
      return h * 60 + m > nowMins;
    });

    if (next) {
      return { name: next, time: (timings[next] ?? "").split(" ")[0] };
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

  const upcomingEvents = useMemo(() => getUpcomingIslamicEvents(3), []);

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
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroTop}>
          <div className={styles.dateMethodRow}>
            <p
              suppressHydrationWarning
              className={mounted && resolvedTheme === "light" ? styles.textWhite : ""}
            >
              {date ?? t("home.todaySchedule")}
            </p>
            <div ref={methodWrapRef} className={styles.heroMethodWrap}>
              <button
                type="button"
                className={styles.heroMethodBtn}
                onClick={() => setMethodOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={methodOpen}
                suppressHydrationWarning
              >
                <span className={styles.heroMethodLabel}>{t("home.method")}</span>
                <span className={styles.heroMethodName} suppressHydrationWarning>
                  {
                    CALCULATION_METHODS.find((m) => m.value === method)?.[
                      isMobile ? "shortLabel" : "label"
                    ]
                  }
                </span>
                <ChevronDown
                  size={12}
                  className={methodOpen ? styles.chevronOpen : styles.chevronIcon}
                />
              </button>
              {methodOpen && (
                <ul role="listbox" className={styles.heroMethodDropdown}>
                  {CALCULATION_METHODS.map((option) => (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={option.value === method}
                      className={`${styles.heroMethodOption} ${option.value === method ? styles.heroMethodOptionActive : ""}`}
                      onClick={() => {
                        setMethod(option.value);
                        setMethodOpen(false);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                  <span className={styles.prayerCardName}>{t(`prayer.${currentPrayer.name}`)}</span>
                </div>
                <p className={styles.prayerCardTime}>{currentPrayer.time}</p>
              </div>
            )}
            <div className={styles.prayerCard}>
              <div className={styles.prayerCardTop}>
                <span className={styles.nextBadge}>{t("home.next")}</span>
                <span className={styles.prayerCardName}>
                  {nextPrayerData
                    ? t(`prayer.${nextPrayerData.name}`)
                    : (nextPrayer ?? t("home.loading"))}
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

        {mounted && (() => {
          const hadith = getDailyHadith();
          return (
            <article className={styles.card}>
              <h2>{t("home.dailyHadith")}</h2>
              <p className={styles.arabic}>{hadith.arabic}</p>
              <p>{locale === "th" ? hadith.translationTh : hadith.translationEn}</p>
              <p className={styles.hadithSource}>
                {t("hadith.narrator")}: {hadith.narrator} — {hadith.source}
              </p>
            </article>
          );
        })()}

        {mounted && upcomingEvents.length > 0 && (
          <article className={styles.card}>
            <h2>{t("events.title")}</h2>
            <ul className={styles.eventsList}>
              {upcomingEvents.map((ev) => (
                <li key={ev.key} className={styles.eventItem}>
                  <div className={styles.eventInfo}>
                    <span className={styles.eventName}>
                      {locale === "th" ? ev.nameTh : ev.nameEn}
                    </span>
                  </div>
                  <span className={styles.eventDays}>
                    {ev.daysAway === 0
                      ? t("events.today")
                      : ev.daysAway === 1
                        ? t("events.tomorrow")
                        : t("events.daysLeft", { n: String(ev.daysAway) })}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/calendar" className={styles.eventsCalendarLink}>
              {t("events.viewCalendar")} →
            </Link>
          </article>
        )}

        <article className={styles.card}>
          <h2>{t("home.quickAccess")}</h2>
          <div className={styles.quickGrid}>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.quickLink}${!link.pinned ? ` ${styles.quickLinkDesktopOnly}` : ""}`}
              >
                <span className={styles.quickLinkIcon}>{link.icon}</span>
                <span>{t(link.labelKey)}</span>
              </Link>
            ))}
            <button type="button" className={styles.moreBtn} onClick={() => setShowMore(true)}>
              <Grid3X3 size={18} />
              <span>{t("home.more")}</span>
            </button>
          </div>
        </article>
      </section>

      <section className={styles.card}>
        <h2>{t("home.todayIntention")}</h2>
        <p>{t("home.intentionBody")}</p>
      </section>

      {showMore && (
        <>
          <div className={styles.sheetBackdrop} onClick={() => setShowMore(false)} />
          <div className={styles.sheet} role="dialog" aria-modal="true">
            <div className={styles.sheetHandle} />
            <div className={styles.sheetHeader}>
              <h3 className={styles.sheetTitle}>{t("home.quickAccess")}</h3>
              <button
                type="button"
                className={styles.sheetClose}
                onClick={() => setShowMore(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {QUICK_LINK_CATEGORIES.map((cat) => {
              const links = QUICK_LINKS.filter((l) => l.category === cat.id);
              return (
                <div key={cat.id} className={styles.sheetCategory}>
                  <p className={styles.sheetCategoryLabel}>{t(cat.labelKey)}</p>
                  <div className={styles.sheetGrid}>
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={styles.sheetLink}
                        onClick={() => setShowMore(false)}
                      >
                        <span className={styles.sheetLinkIcon}>{link.icon}</span>
                        <span className={styles.sheetLinkLabel}>{t(link.labelKey)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
