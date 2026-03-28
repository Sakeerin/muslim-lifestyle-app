"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VirtualizedAyahList, type AyahView } from "@/components/features/virtualized-ayah-list";
import { useI18n } from "@/i18n/i18n-context";
import { useQuranProgress } from "@/hooks/use-quran-progress";
import styles from "./page.module.css";

type SurahAyah = {
  numberInSurah: number;
  text: string;
  audio?: string;
};

type SurahPayload = {
  data: {
    englishName: string;
    englishNameTranslation: string;
    name: string;
    ayahs: SurahAyah[];
  };
};

type SurahPageProps = {
  params: Promise<{ surah: string }>;
};

export default function SurahPage({ params }: SurahPageProps) {
  const readingModeStorageKey = "quran-reading-mode";
  const readingModeHintStorageKey = "quran-reading-mode-hint-shown";
  const [ayahs, setAyahs] = useState<AyahView[]>([]);
  const [audioAyahs, setAudioAyahs] = useState<SurahAyah[]>([]);
  const [surahInfo, setSurahInfo] = useState<{
    englishName: string;
    englishNameTranslation: string;
    name: string;
  } | null>(null);
  const [activeAyah, setActiveAyah] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [readingMode, setReadingMode] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationLang, setTranslationLang] = useState<"en.asad" | "th.thai">("en.asad");
  const [hasShownModeHint, setHasShownModeHint] = useState(false);
  const [showModeSavedHint, setShowModeSavedHint] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [surahId, setSurahId] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track which surahId has already been marked to avoid re-marking on translationLang change
  const markedSurahRef = useRef<string | null>(null);
  const { t } = useI18n();
  const { markAsRead } = useQuranProgress();

  useEffect(() => {
    try {
      const storedMode = window.localStorage.getItem(readingModeStorageKey);
      if (storedMode === "compact") {
        setReadingMode(false);
      }
      if (storedMode === "reading") {
        setReadingMode(true);
      }

      const storedTranslationMode = window.localStorage.getItem("quran-show-translation");
      if (storedTranslationMode !== null) {
        setShowTranslation(storedTranslationMode === "true");
      }

      const storedLang = window.localStorage.getItem("quran-translation-lang");
      if (storedLang === "th.thai" || storedLang === "en.asad") {
        setTranslationLang(storedLang);
      }

      const hintShown = window.localStorage.getItem(readingModeHintStorageKey);
      if (hintShown === "1") {
        setHasShownModeHint(true);
      }
    } catch {}

    setHasMounted(true);
  }, [readingModeHintStorageKey, readingModeStorageKey]);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    try {
      window.localStorage.setItem(readingModeStorageKey, readingMode ? "reading" : "compact");
      window.localStorage.setItem("quran-show-translation", String(showTranslation));
      window.localStorage.setItem("quran-translation-lang", translationLang);
    } catch {}
  }, [hasMounted, readingMode, showTranslation, translationLang, readingModeStorageKey]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  const handleReadingModeChange = (nextReadingMode: boolean) => {
    setReadingMode(nextReadingMode);

    if (!hasMounted || hasShownModeHint) {
      return;
    }

    setShowModeSavedHint(true);
    setHasShownModeHint(true);

    try {
      window.localStorage.setItem(readingModeHintStorageKey, "1");
    } catch {}

    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }

    hintTimeoutRef.current = setTimeout(() => {
      setShowModeSavedHint(false);
    }, 2200);
  };

  useEffect(() => {
    let mounted = true;

    async function resolveParams() {
      const resolved = await params;
      if (mounted) {
        setSurahId(resolved.surah);
      }
    }

    void resolveParams();

    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!surahId) {
      return;
    }

    let mounted = true;

    async function loadSurahData() {
      try {
        const [arabicResponse, translationResponse, audioResponse] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}`, { cache: "no-store" }),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${translationLang}`, {
            cache: "no-store",
          }),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.alafasy`, { cache: "no-store" }),
        ]);

        if (!arabicResponse.ok || !translationResponse.ok || !audioResponse.ok) {
          throw new Error("Unable to fetch surah");
        }

        const arabicPayload = (await arabicResponse.json()) as SurahPayload;
        const translationPayload = (await translationResponse.json()) as SurahPayload;
        const audioPayload = (await audioResponse.json()) as SurahPayload;

        if (!mounted) {
          return;
        }

        const combinedAyahs = arabicPayload.data.ayahs.map((ayah, index) => ({
          numberInSurah: ayah.numberInSurah,
          arabic: ayah.text,
          translation: translationPayload.data.ayahs[index]?.text ?? "",
        }));

        setSurahInfo({
          englishName: arabicPayload.data.englishName,
          englishNameTranslation: arabicPayload.data.englishNameTranslation,
          name: arabicPayload.data.name,
        });
        // Only mark as read once per surah navigation, not on every translationLang re-fetch
        if (markedSurahRef.current !== surahId) {
          markedSurahRef.current = surahId;
          markAsRead(Number(surahId), arabicPayload.data.englishName, arabicPayload.data.name);
        }
        setAyahs(combinedAyahs);
        setAudioAyahs(audioPayload.data.ayahs);
      } catch {
        if (!mounted) {
          return;
        }

        setAyahs([]);
      }
    }

    void loadSurahData();

    return () => {
      mounted = false;
    };
  }, [surahId, translationLang, markAsRead]);

  const currentAudio = useMemo(() => {
    const source = audioAyahs[activeAyah]?.audio;
    return source && source.trim().length > 0 ? source : undefined;
  }, [activeAyah, audioAyahs]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentAudio) {
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

  useEffect(() => {
    setIsPlaying(false);
  }, [currentAudio]);

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>
          {surahInfo?.englishName ?? t("quran.surah")} - {surahInfo?.name ?? ""}
        </h1>
        <p>{surahInfo?.englishNameTranslation}</p>
      </section>

      <section className={styles.card}>
        <h2>{t("surah.audioControls")}</h2>
        <div className={styles.controls}>
          <button type="button" onClick={() => setActiveAyah((value) => Math.max(0, value - 1))}>
            {t("surah.previousAyah")}
          </button>
          <button type="button" onClick={togglePlay}>
            {isPlaying ? t("surah.pause") : t("surah.play")}
          </button>
          <button
            type="button"
            onClick={() => setActiveAyah((value) => Math.min(audioAyahs.length - 1, value + 1))}
          >
            {t("surah.nextAyah")}
          </button>
        </div>
        <p>{t("surah.playingAyah", { number: audioAyahs[activeAyah]?.numberInSurah ?? 1 })}</p>
        {hasMounted && currentAudio ? (
          <audio
            key={currentAudio}
            ref={audioRef}
            src={currentAudio || undefined}
            onEnded={() => {
              setIsPlaying(false);
              setActiveAyah((value) => Math.min(audioAyahs.length - 1, value + 1));
            }}
          />
        ) : null}
      </section>

      <section className={styles.card}>
        <div className={styles.readingModeHeader}>
          <h2>{t("surah.ayahs")}</h2>
          <div className={styles.modeToggle} role="group" aria-label={t("surah.readingDensity")}>
            <button
              type="button"
              className={readingMode ? styles.activeModeButton : ""}
              onClick={() => handleReadingModeChange(true)}
            >
              {t("surah.readingMode")}
            </button>
            <button
              type="button"
              className={!readingMode ? styles.activeModeButton : ""}
              onClick={() => handleReadingModeChange(false)}
            >
              {t("surah.compactMode")}
            </button>
          </div>
        </div>

        <div className={styles.translationControls}>
          <label className={styles.translationLabel}>
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
            />
            {t("surah.showTranslation")}
          </label>

          <select
            className={styles.languageSelect}
            value={translationLang}
            onChange={(e) => setTranslationLang(e.target.value as "en.asad" | "th.thai")}
            aria-label={t("surah.selectTranslation")}
            style={{ display: showTranslation ? undefined : "none" }}
          >
            <option value="en.asad">{t("surah.english")}</option>
            <option value="th.thai">{t("surah.thai")}</option>
          </select>
        </div>

        {showModeSavedHint ? (
          <p className={styles.modeSavedHint}>{t("surah.preferenceSaved")}</p>
        ) : null}
        <VirtualizedAyahList
          ayahs={ayahs}
          mode={readingMode ? "reading" : "compact"}
          showTranslation={showTranslation}
        />

        {surahId &&
          (() => {
            const surahNum = Number(surahId);
            return (
              <div className={styles.surahNav}>
                {surahNum > 1 ? (
                  <Link href={`/quran/${surahNum - 1}`} className={styles.surahNavBtn}>
                    <ChevronLeft size={18} className={styles.navIcon} />
                    <span className={styles.navText}>
                      <span className={styles.navDir}>{t("surah.prevSurah")}</span>
                      <span className={styles.navNum}>
                        {t("surah.surahN", { n: String(surahNum - 1) })}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {surahNum < 114 ? (
                  <Link
                    href={`/quran/${surahNum + 1}`}
                    className={`${styles.surahNavBtn} ${styles.surahNavBtnNext}`}
                  >
                    <span className={styles.navText}>
                      <span className={styles.navDir}>{t("surah.nextSurah")}</span>
                      <span className={styles.navNum}>
                        {t("surah.surahN", { n: String(surahNum + 1) })}
                      </span>
                    </span>
                    <ChevronRight size={18} className={styles.navIcon} />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            );
          })()}
      </section>
    </div>
  );
}
