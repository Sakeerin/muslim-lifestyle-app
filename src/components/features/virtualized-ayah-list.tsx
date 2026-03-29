"use client";

import styles from "./virtualized-ayah-list.module.css";

export type AyahView = {
  numberInSurah: number;
  arabic: string;
  translation: string;
};

type VirtualizedAyahListProps = {
  ayahs: AyahView[];
  mode?: "compact" | "reading";
  showTranslation?: boolean;
  surahNumber?: number;
  surahNameEn?: string;
  surahNameAr?: string;
  fontSize?: "sm" | "md" | "lg";
};

export function VirtualizedAyahList({
  ayahs,
  mode = "reading",
  showTranslation = true,
  surahNumber,
  surahNameEn,
  surahNameAr,
  fontSize = "md",
}: VirtualizedAyahListProps) {
  const isCompact = mode === "compact";
  const fontSizeClass = fontSize === "sm" ? styles.fontSm : fontSize === "lg" ? styles.fontLg : "";

  return (
    <div
      className={`${styles.container} ${isCompact ? styles.compactContainer : styles.readingContainer} ${fontSizeClass}`}
    >
      {ayahs.map((ayah) => (
        <article
          key={ayah.numberInSurah}
          className={`${styles.row} ${isCompact ? styles.compactRow : styles.readingRow}`}
        >
          <div className={styles.ayahHeader}>
            <div className={styles.ayahBadge}>
              <span className={styles.ayahRef}>
                {surahNumber ?? "—"}:{ayah.numberInSurah}
              </span>
              {surahNameEn && (
                <span className={styles.ayahNames}>
                  <span className={styles.ayahNameEn}>{surahNameEn}</span>
                  {surahNameAr && <span className={styles.ayahNameAr}>{surahNameAr}</span>}
                </span>
              )}
            </div>
          </div>
          <p
            className={`${styles.arabic} ${isCompact ? styles.compactArabic : styles.readingArabic}`}
          >
            {ayah.arabic}
          </p>
          {showTranslation && (
            <p
              className={`${styles.translation} ${isCompact ? styles.compactTranslation : styles.readingTranslation}`}
            >
              {ayah.translation}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
