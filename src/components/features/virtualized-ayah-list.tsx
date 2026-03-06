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
};

export function VirtualizedAyahList({
  ayahs,
  mode = "reading",
  showTranslation = true,
}: VirtualizedAyahListProps) {
  const isCompact = mode === "compact";

  return (
    <div
      className={`${styles.container} ${isCompact ? styles.compactContainer : styles.readingContainer}`}
    >
      {ayahs.map((ayah) => (
        <article
          key={ayah.numberInSurah}
          className={`${styles.row} ${isCompact ? styles.compactRow : styles.readingRow}`}
        >
          <strong>Ayah {ayah.numberInSurah}</strong>
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
