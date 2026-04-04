"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ListMusic,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  StopCircle,
  X,
} from "lucide-react";
import { VirtualizedAyahList, type AyahView } from "@/components/features/virtualized-ayah-list";
import { useI18n } from "@/i18n/i18n-context";
import { useQuranProgress } from "@/hooks/use-quran-progress";
import { useQuranMemorization } from "@/hooks/use-quran-memorization";
import { useAyahNotes } from "@/hooks/use-ayah-notes";
import { QURAN_RECITERS, useQuranReciter } from "@/hooks/use-quran-reciter";
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

const READING_MODE_KEY = "quran-reading-mode";
const TRANSLATION_LANG_KEY = "quran-translation-lang";
const SHOW_TRANSLATION_KEY = "quran-show-translation";
const FONT_SIZE_KEY = "quran-font-size";

const TAB_LABELS = {
  display: "surah.tabDisplay",
  text: "surah.tabText",
  audio: "surah.tabAudio",
} as const;

const FONT_SIZE_LABELS = {
  sm: "surah.fontSm",
  md: "surah.fontMd",
  lg: "surah.fontLg",
} as const;

export default function SurahPage({ params }: SurahPageProps) {
  const [ayahs, setAyahs] = useState<AyahView[]>([]);
  const [audioAyahs, setAudioAyahs] = useState<SurahAyah[]>([]);
  const [surahInfo, setSurahInfo] = useState<{
    englishName: string;
    englishNameTranslation: string;
    name: string;
  } | null>(null);
  const [activeAyah, setActiveAyah] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [readingMode, setReadingMode] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationLang, setTranslationLang] = useState<"en.asad" | "th.thai">("en.asad");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"display" | "text" | "audio">("display");
  const [hasMounted, setHasMounted] = useState(false);
  const [surahId, setSurahId] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Track which surahId has already been marked to avoid re-marking on translationLang change
  const markedSurahRef = useRef<string | null>(null);
  const { t } = useI18n();
  const { markAsRead, addBookmark, removeBookmark, progress } = useQuranProgress();
  const { memo: memoMap, cycleStatus: cycleMemo, surahMemoCount } = useQuranMemorization();
  const { notes: ayahNotesMap, setNote: saveAyahNote } = useAyahNotes();
  const { activeReciter, reciterId, setReciterId } = useQuranReciter();

  const surahNum = Number(surahId);

  const memoStatusesBySurah = useMemo(() => {
    const map: Record<number, "learning" | "memorized"> = {};
    for (const [key, status] of Object.entries(memoMap)) {
      const [s, a] = key.split(":");
      if (Number(s) === surahNum) map[Number(a)] = status;
    }
    return map;
  }, [memoMap, surahNum]);

  const ayahNotesBySurah = useMemo(() => {
    const map: Record<number, string> = {};
    for (const [key, text] of Object.entries(ayahNotesMap)) {
      const [s, a] = key.split(":");
      if (Number(s) === surahNum) map[Number(a)] = text;
    }
    return map;
  }, [ayahNotesMap, surahNum]);

  useEffect(() => {
    try {
      const storedMode = window.localStorage.getItem(READING_MODE_KEY);
      if (storedMode === "compact") setReadingMode(false);
      if (storedMode === "reading") setReadingMode(true);

      const storedTranslationMode = window.localStorage.getItem(SHOW_TRANSLATION_KEY);
      if (storedTranslationMode !== null) {
        setShowTranslation(storedTranslationMode === "true");
      }

      const storedLang = window.localStorage.getItem(TRANSLATION_LANG_KEY);
      if (storedLang === "th.thai" || storedLang === "en.asad") {
        setTranslationLang(storedLang);
      }

      const storedFontSize = window.localStorage.getItem(FONT_SIZE_KEY);
      if (storedFontSize === "sm" || storedFontSize === "md" || storedFontSize === "lg") {
        setFontSize(storedFontSize);
      }
    } catch {}

    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    try {
      window.localStorage.setItem(READING_MODE_KEY, readingMode ? "reading" : "compact");
      window.localStorage.setItem(SHOW_TRANSLATION_KEY, String(showTranslation));
      window.localStorage.setItem(TRANSLATION_LANG_KEY, translationLang);
      window.localStorage.setItem(FONT_SIZE_KEY, fontSize);
    } catch {}
  }, [hasMounted, readingMode, showTranslation, translationLang, fontSize]);

  useEffect(() => {
    if (!showSettings) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSettings(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showSettings]);

  useEffect(() => {
    if (showSettings) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSettings]);

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

  // Pause audio on component unmount (prevents audio continuing after navigation)
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  // Reset audio state whenever the surah changes
  useEffect(() => {
    if (!surahId) return;
    setActiveAyah(0);
    setIsAutoPlay(false);
    setIsPlaying(false);
    audioRef.current?.pause();
  }, [surahId]);

  useEffect(() => {
    if (!surahId) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    async function loadSurahData() {
      try {
        const [arabicResponse, translationResponse, audioResponse] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}`, { signal }),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${translationLang}`, { signal }),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${activeReciter.apiEdition}`, {
            signal,
          }),
        ]);

        if (!arabicResponse.ok || !translationResponse.ok || !audioResponse.ok) {
          throw new Error("Unable to fetch surah");
        }

        const arabicPayload = (await arabicResponse.json()) as SurahPayload;
        const translationPayload = (await translationResponse.json()) as SurahPayload;
        const audioPayload = (await audioResponse.json()) as SurahPayload;

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
      } catch (err) {
        // Ignore AbortError — this is expected when the effect re-runs before fetch completes
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setAyahs([]);
      }
    }

    void loadSurahData();

    return () => {
      controller.abort();
    };
  }, [surahId, translationLang, markAsRead, activeReciter.apiEdition]);

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

  const startAutoPlay = () => {
    if (audioAyahs.length === 0) return;
    setActiveAyah(0);
    setIsAutoPlay(true);
  };

  const stopAutoPlay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsAutoPlay(false);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlay || !currentAudio) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setIsAutoPlay(false);
        setIsPlaying(false);
      });
  }, [isAutoPlay, currentAudio]);

  // When a new ayah's audio loads and we are NOT in auto-play, clear the playing flag
  // (the auto-play effect handles playing in auto-play mode)
  useEffect(() => {
    if (!isAutoPlay) {
      setIsPlaying(false);
    }
  }, [currentAudio, isAutoPlay]);

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>
          {surahInfo?.englishName ?? t("quran.surah")} - {surahInfo?.name ?? ""}
        </h1>
        <p>{surahInfo?.englishNameTranslation}</p>
      </section>

      <section className={styles.card}>
        <div className={styles.ayahsHeader}>
          <h2>{t("surah.audioControls")}</h2>
          <button
            type="button"
            className={styles.settingsBtn}
            onClick={() => setShowSettings(true)}
            aria-label={t("surah.settingsTitle")}
          >
            <Settings size={17} />
          </button>
        </div>
        <div className={styles.audioPlayer}>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setActiveAyah((value) => Math.max(0, value - 1))}
              aria-label={t("surah.previousAyah")}
            >
              <SkipBack size={16} />
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.playBtn}`}
              onClick={togglePlay}
              aria-label={isPlaying ? t("surah.pause") : t("surah.play")}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() =>
                setActiveAyah((value) =>
                  audioAyahs.length > 0 ? Math.min(audioAyahs.length - 1, value + 1) : 0,
                )
              }
              aria-label={t("surah.nextAyah")}
            >
              <SkipForward size={16} />
            </button>
          </div>
          <p className={styles.ayahIndicator}>
            {t("surah.playingAyah", { number: audioAyahs[activeAyah]?.numberInSurah ?? 1 })}
          </p>
          <button
            type="button"
            className={`${styles.fullPlayBtn} ${isAutoPlay ? styles.fullPlayBtnActive : ""}`}
            onClick={isAutoPlay ? stopAutoPlay : startAutoPlay}
          >
            {isAutoPlay ? (
              <>
                <StopCircle size={15} />
                {t("surah.stopFullPlay")}
              </>
            ) : (
              <>
                <ListMusic size={15} />
                {t("surah.playFull")}
              </>
            )}
          </button>
        </div>
        {hasMounted && currentAudio ? (
          <audio
            key={currentAudio}
            ref={audioRef}
            src={currentAudio}
            onEnded={() => {
              setIsPlaying(false);
              const lastIndex = audioAyahs.length - 1;
              if (lastIndex < 0 || activeAyah >= lastIndex) {
                setIsAutoPlay(false);
              } else {
                setActiveAyah((value) => Math.min(lastIndex, value + 1));
              }
            }}
          />
        ) : null}
      </section>

      <section className={styles.card}>
        {surahId && ayahs.length > 0 && (() => {
          const surahNum = Number(surahId);
          const memoCount = surahMemoCount(surahNum);
          if (memoCount === 0) return null;
          return (
            <p className={styles.memoProgress}>
              {t("memo.progressLabel", { count: String(memoCount) })}
              {" "}({memoCount}/{ayahs.length})
            </p>
          );
        })()}
        <VirtualizedAyahList
          ayahs={ayahs}
          mode={readingMode ? "reading" : "compact"}
          showTranslation={showTranslation}
          surahNumber={surahId && !isNaN(Number(surahId)) ? Number(surahId) : undefined}
          surahNameEn={surahInfo?.englishName}
          surahNameAr={surahInfo?.name}
          fontSize={fontSize}
          bookmarkedAyahs={
            progress.bookmarks
              ?.filter((b) => b.surah === Number(surahId))
              .map((b) => b.ayah) ?? []
          }
          onToggleBookmark={(ayahNum) => {
            const surahNum = Number(surahId);
            const alreadyBookmarked = progress.bookmarks?.some(
              (b) => b.surah === surahNum && b.ayah === ayahNum,
            );
            if (alreadyBookmarked) {
              removeBookmark(surahNum, ayahNum);
            } else {
              addBookmark(
                surahNum,
                surahInfo?.englishName ?? "",
                surahInfo?.name ?? "",
                ayahNum,
                "",
              );
            }
          }}
          memoStatuses={memoStatusesBySurah}
          onCycleMemo={(ayahNum) => cycleMemo(surahNum, ayahNum)}
          ayahNotes={ayahNotesBySurah}
          onSaveNote={(ayahNum, text) => saveAyahNote(surahNum, ayahNum, text)}
          notePlaceholder={t("ayahnote.placeholder")}
          noteSaveLabel={t("ayahnote.save")}
          noteCancelLabel={t("ayahnote.cancel")}
          noteDeleteLabel={t("ayahnote.delete")}
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

      {/* ── Settings Modal ── */}
      {showSettings && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowSettings(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHandle} />
            <div className={styles.modalHeader}>
              <h2 id="settings-modal-title">{t("surah.settingsTitle")}</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowSettings(false)}
                aria-label={t("surah.closeSettings")}
              >
                <X size={16} />
              </button>
            </div>

            <div className={styles.modalTabs}>
              {(["display", "text", "audio"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`${styles.modalTab} ${settingsTab === tab ? styles.modalTabActive : ""}`}
                  onClick={() => setSettingsTab(tab)}
                >
                  {t(TAB_LABELS[tab])}
                </button>
              ))}
            </div>

            <div className={styles.modalBody}>
              {/* ── Display tab ── */}
              {settingsTab === "display" && (
                <>
                  <div className={styles.modalSection}>
                    <p className={styles.modalSectionLabel}>{t("surah.settingReadingMode")}</p>
                    <div className={styles.segControl}>
                      <button
                        type="button"
                        className={`${styles.segBtn} ${readingMode ? styles.segBtnActive : ""}`}
                        onClick={() => setReadingMode(true)}
                      >
                        {t("surah.readingMode")}
                      </button>
                      <button
                        type="button"
                        className={`${styles.segBtn} ${!readingMode ? styles.segBtnActive : ""}`}
                        onClick={() => setReadingMode(false)}
                      >
                        {t("surah.compactMode")}
                      </button>
                    </div>
                  </div>

                  <div className={styles.modalSection}>
                    <p className={styles.modalSectionLabel}>{t("surah.settingFontSize")}</p>
                    <div className={styles.fontSizeRow}>
                      {(["sm", "md", "lg"] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`${styles.fontSizeBtn} ${fontSize === size ? styles.fontSizeBtnActive : ""}`}
                          onClick={() => setFontSize(size)}
                        >
                          <span
                            className={
                              size === "sm"
                                ? styles.fontPreviewSm
                                : size === "lg"
                                  ? styles.fontPreviewLg
                                  : styles.fontPreviewMd
                            }
                          >
                            ب
                          </span>
                          <span className={styles.fontSizeLabel}>{t(FONT_SIZE_LABELS[size])}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Text tab ── */}
              {settingsTab === "text" && (
                <>
                  <div className={styles.modalSection}>
                    <div className={styles.toggleRow}>
                      <span className={styles.toggleLabel}>
                        {t("surah.settingShowTranslation")}
                      </span>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={showTranslation}
                          onChange={(e) => setShowTranslation(e.target.checked)}
                        />
                        <span className={styles.toggleTrack} />
                      </label>
                    </div>
                  </div>

                  {showTranslation && (
                    <div className={styles.modalSection}>
                      <p className={styles.modalSectionLabel}>{t("surah.settingLanguage")}</p>
                      <div className={styles.langRow}>
                        <button
                          type="button"
                          className={`${styles.langBtn} ${translationLang === "en.asad" ? styles.langBtnActive : ""}`}
                          onClick={() => setTranslationLang("en.asad")}
                        >
                          {t("surah.english")}
                        </button>
                        <button
                          type="button"
                          className={`${styles.langBtn} ${translationLang === "th.thai" ? styles.langBtnActive : ""}`}
                          onClick={() => setTranslationLang("th.thai")}
                        >
                          {t("surah.thai")}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Audio tab ── */}
              {settingsTab === "audio" && (
                <div className={styles.modalSection}>
                  <p className={styles.modalSectionLabel}>{t("surah.settingReciter")}</p>
                  <div className={styles.reciterList}>
                    {QURAN_RECITERS.map((reciter) => (
                      <button
                        key={reciter.id}
                        type="button"
                        className={`${styles.reciterItem} ${reciterId === reciter.id ? styles.reciterItemActive : ""}`}
                        onClick={() => setReciterId(reciter.id)}
                      >
                        <div className={styles.reciterRadio}>
                          {reciterId === reciter.id && <span className={styles.reciterRadioDot} />}
                        </div>
                        <div className={styles.reciterInfo}>
                          <div className={styles.reciterName}>{reciter.nameTh}</div>
                          <div className={styles.reciterStyle}>
                            {reciter.origin} · {reciter.styleTh}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
