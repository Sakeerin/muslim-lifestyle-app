"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Download, RotateCcw, Upload } from "lucide-react";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { useI18n } from "@/i18n/i18n-context";
import { PRAYER_NAMES, RECITERS, useAzanSettings, type Reciter } from "@/hooks/use-azan-settings";
import { QURAN_RECITERS, useQuranReciter, type QuranReciter } from "@/hooks/use-quran-reciter";
import { useQuranProgress } from "@/hooks/use-quran-progress";
import { useQuranMemorization } from "@/hooks/use-quran-memorization";
import styles from "./page.module.css";

const PRAYER_ICONS: Record<string, string> = {
  Fajr: "🌄",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌆",
  Isha: "🌙",
};

export default function SettingsPage() {
  const { locale, setLocale, t } = useI18n();
  const { toggles, togglePrayer, reciterId, setReciterId } = useAzanSettings();
  const { reciterId: quranReciterId, setReciterId: setQuranReciterId } = useQuranReciter();
  const { progress, resetProgress, exportData, importData, removeBookmark } = useQuranProgress();
  const { totals: memoTotals, bysurah: memoBysurah, clearAll: clearMemo } = useQuranMemorization();
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const handleQuranPreview = (reciter: QuranReciter) => {
    const pid = `q:${reciter.id}`;
    setPreviewError(null);
    if (previewId === pid) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setPreviewId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(reciter.previewUrl);
    audioRef.current = audio;
    audio.onended = () => setPreviewId(null);
    audio.onerror = () => {
      setPreviewId(null);
      setPreviewError(pid);
    };
    void audio.play().catch(() => {
      setPreviewId(null);
      setPreviewError(pid);
    });
    setPreviewId(pid);
  };

  const handlePreview = (reciter: Reciter) => {
    setPreviewError(null);
    if (previewId === reciter.id) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setPreviewId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(reciter.audioUrl);
    audioRef.current = audio;
    audio.onended = () => setPreviewId(null);
    audio.onerror = () => {
      setPreviewId(null);
      setPreviewError(reciter.id);
    };
    void audio.play().catch(() => {
      setPreviewId(null);
      setPreviewError(reciter.id);
    });
    setPreviewId(reciter.id);
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>{t("settings.title")}</h1>
        <p>{t("settings.subtitle")}</p>
      </section>

      <section className={styles.card}>
        <h2>{t("settings.appearance")}</h2>
        <ThemeToggle />
      </section>

      <section className={styles.card}>
        <h2>{t("settings.language")}</h2>
        <div className={styles.list}>
          <button
            type="button"
            className={`${styles.item} ${locale === "en" ? styles.activeItem : ""}`}
            onClick={() => setLocale("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`${styles.item} ${locale === "th" ? styles.activeItem : ""}`}
            onClick={() => setLocale("th")}
          >
            ภาษาไทย (Thai)
          </button>
        </div>
      </section>

      {/* ── Prayer notification toggles ──────────── */}
      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>{t("settings.prayerReminders")}</h2>
            <p className={styles.sectionDesc}>{t("settings.prayerRemindersDesc")}</p>
          </div>
          {permission === null ? null : permission === "granted" ? (
            <span className={styles.permGranted}>✓ {t("settings.permissionGranted")}</span>
          ) : (
            <button
              type="button"
              className={`${styles.permBtn} ${permission === "denied" ? styles.permDenied : ""}`}
              onClick={requestPermission}
              disabled={permission === "denied"}
            >
              {permission === "denied"
                ? t("settings.permissionDenied")
                : t("settings.requestPermission")}
            </button>
          )}
        </div>
        <div className={styles.toggleList}>
          {PRAYER_NAMES.map((prayer) => (
            <div key={prayer} className={styles.toggleRow}>
              <span className={styles.prayerIcon}>{PRAYER_ICONS[prayer]}</span>
              <span className={styles.prayerLabel}>{t(`prayer.${prayer}`)}</span>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[prayer]}
                className={`${styles.toggle} ${toggles[prayer] ? styles.toggleOn : ""}`}
                onClick={() => togglePrayer(prayer)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Reciter selection ────────────────────── */}
      <section className={styles.card}>
        <h2>{t("settings.reciter")}</h2>
        <p className={styles.sectionDesc}>{t("settings.reciterDesc")}</p>
        <div className={styles.reciterList}>
          {RECITERS.map((reciter) => (
            <div
              key={reciter.id}
              className={`${styles.reciterRow} ${reciterId === reciter.id ? styles.reciterActive : ""}`}
              onClick={() => setReciterId(reciter.id)}
              role="radio"
              aria-checked={reciterId === reciter.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setReciterId(reciter.id);
                }
              }}
            >
              <div className={styles.reciterRadio}>
                {reciterId === reciter.id && <span className={styles.reciterDot} />}
              </div>
              <div className={styles.reciterInfo}>
                <p className={styles.reciterName}>
                  {locale === "th" ? reciter.nameTh : reciter.nameEn}
                </p>
                <p className={styles.reciterOrigin}>{reciter.origin}</p>
              </div>
              <button
                type="button"
                className={`${styles.previewBtn} ${previewId === reciter.id ? styles.previewBtnActive : ""} ${previewError === reciter.id ? styles.previewBtnError : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(reciter);
                }}
                aria-label={previewId === reciter.id ? t("settings.stop") : t("settings.preview")}
                title={previewError === reciter.id ? t("settings.previewError") : undefined}
              >
                {previewError === reciter.id ? "✕" : previewId === reciter.id ? "■" : "▶"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quran Reciter Selection ──────────────── */}
      <section className={styles.card}>
        <h2>{t("settings.quranReciter")}</h2>
        <p className={styles.sectionDesc}>{t("settings.quranReciterDesc")}</p>
        <div className={styles.reciterList}>
          {QURAN_RECITERS.map((reciter) => {
            const pid = `q:${reciter.id}`;
            const isPlaying = previewId === pid;
            const isError = previewError === pid;
            return (
              <div
                key={reciter.id}
                className={`${styles.reciterRow} ${quranReciterId === reciter.id ? styles.reciterActive : ""}`}
                onClick={() => setQuranReciterId(reciter.id)}
                role="radio"
                aria-checked={quranReciterId === reciter.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setQuranReciterId(reciter.id);
                  }
                }}
              >
                <div className={styles.reciterRadio}>
                  {quranReciterId === reciter.id && <span className={styles.reciterDot} />}
                </div>
                <div className={styles.reciterInfo}>
                  <p className={styles.reciterName}>
                    {locale === "th" ? reciter.nameTh : reciter.nameEn}
                  </p>
                  <p className={styles.reciterOrigin}>{reciter.origin}</p>
                  <span className={styles.reciterStyle}>
                    {locale === "th" ? reciter.styleTh : reciter.styleEn}
                  </span>
                </div>
                <button
                  type="button"
                  className={`${styles.previewBtn} ${isPlaying ? styles.previewBtnActive : ""} ${isError ? styles.previewBtnError : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuranPreview(reciter);
                  }}
                  aria-label={isPlaying ? t("settings.stop") : t("settings.preview")}
                  title={isError ? t("settings.previewError") : undefined}
                >
                  {isError ? "✕" : isPlaying ? "■" : "▶"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quran Reading Progress ───────────────── */}
      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>{t("settings.quranSync")}</h2>
            <p className={styles.sectionDesc}>{t("settings.quranSyncDesc")}</p>
          </div>
          <BookOpen size={22} className={styles.syncIcon} />
        </div>

        {progress.lastSurah ? (
          <div className={styles.lastReadCard}>
            <div className={styles.lastReadInfo}>
              <span className={styles.lastReadLabel}>{t("settings.lastRead")}</span>
              <p className={styles.lastReadName}>
                {progress.lastSurahName}
                <span className={styles.lastReadAr}> · {progress.lastSurahNameAr}</span>
              </p>
              {progress.lastReadAt && (
                <p className={styles.lastReadDate} suppressHydrationWarning>
                  {new Date(progress.lastReadAt).toLocaleDateString(
                    locale === "th" ? "th-TH" : "en-GB",
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                </p>
              )}
            </div>
            <Link href={`/quran/${progress.lastSurah}`} className={styles.continueBtn}>
              {t("settings.continueReading")} →
            </Link>
          </div>
        ) : (
          <p className={styles.neverRead}>{t("settings.neverRead")}</p>
        )}

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              {t("settings.surahsVisited", {
                count: String(progress.visitedSurahs.length),
              })}
            </span>
            <span className={styles.progressPct}>
              {Math.round((progress.visitedSurahs.length / 114) * 100)}%
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(progress.visitedSurahs.length / 114) * 100}%` }}
            />
          </div>
        </div>

        <div className={styles.syncActions}>
          <button type="button" className={styles.syncBtn} onClick={exportData}>
            <Download size={14} />
            {t("settings.exportProgress")}
          </button>
          <button
            type="button"
            className={styles.syncBtn}
            onClick={() => importInputRef.current?.click()}
          >
            <Upload size={14} />
            {t("settings.importProgress")}
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            className={styles.hiddenInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importData(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className={`${styles.syncBtn} ${styles.syncBtnDanger}`}
            onClick={() => {
              if (window.confirm(t("settings.confirmReset"))) resetProgress();
            }}
          >
            <RotateCcw size={14} />
            {t("settings.resetProgress")}
          </button>
        </div>
      </section>

      {/* ── Quran Memorization ──────────────────── */}
      <section className={styles.card}>
        <h2>{t("memo.settingsTitle")}</h2>
        <p className={styles.subtitle}>{t("memo.settingsDesc")}</p>
        {(() => {
          const { memorized, learning } = memoTotals();
          const rows = memoBysurah();
          if (memorized === 0 && learning === 0) {
            return <p className={styles.neverRead}>{t("memo.noMemo")}</p>;
          }
          return (
            <>
              <div className={styles.memoSummaryRow}>
                <span className={styles.memoStat}>{t("memo.totalMemo", { count: String(memorized) })}</span>
                {learning > 0 && (
                  <span className={styles.memoStatLearning}>{t("memo.totalLearning", { count: String(learning) })}</span>
                )}
              </div>
              <div className={styles.memoList}>
                {rows.map((r) => (
                  <div key={r.surah} className={styles.memoRow}>
                    <Link href={`/quran/${r.surah}`} className={styles.memoSurahLink}>
                      Surah {r.surah}
                    </Link>
                    <span className={styles.memoRowCounts}>
                      {r.memorized > 0 && <span className={styles.memoCount}>✅ {r.memorized}</span>}
                      {r.learning > 0 && <span className={styles.memoCountLearning}>📖 {r.learning}</span>}
                    </span>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.resetBtn} onClick={clearMemo}>
                {t("memo.clearAll")}
              </button>
            </>
          );
        })()}
      </section>

      {/* ── Quran Bookmarks ─────────────────────── */}
      <section className={styles.card}>
        <h2>{t("quran.bookmarks")}</h2>
        {!progress.bookmarks || progress.bookmarks.length === 0 ? (
          <p className={styles.neverRead}>{t("quran.noBookmarks")}</p>
        ) : (
          <div className={styles.bookmarkList}>
            {[...progress.bookmarks]
              .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
              .map((bm) => (
                <div key={`${bm.surah}-${bm.ayah}`} className={styles.bookmarkItem}>
                  <div className={styles.bookmarkInfo}>
                    <Link
                      href={`/quran/${bm.surah}`}
                      className={styles.bookmarkLink}
                    >
                      {bm.surahName}
                      <span className={styles.bookmarkRef}> {bm.surah}:{bm.ayah}</span>
                    </Link>
                    {bm.note && <p className={styles.bookmarkNote}>{bm.note}</p>}
                    <p className={styles.bookmarkDate} suppressHydrationWarning>
                      {new Date(bm.savedAt).toLocaleDateString(
                        locale === "th" ? "th-TH" : "en-GB",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.removeBookmarkBtn}
                    onClick={() => removeBookmark(bm.surah, bm.ayah)}
                    aria-label={t("quran.removeBookmark")}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
