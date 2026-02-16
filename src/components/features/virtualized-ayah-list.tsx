"use client";

import { useMemo, useState } from "react";
import styles from "./virtualized-ayah-list.module.css";

export type AyahView = {
  numberInSurah: number;
  arabic: string;
  translation: string;
};

type VirtualizedAyahListProps = {
  ayahs: AyahView[];
};

const ROW_HEIGHT = 180;
const OVERSCAN = 3;

export function VirtualizedAyahList({ ayahs }: VirtualizedAyahListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const viewportHeight = 540;

  const { startIndex, endIndex, totalHeight } = useMemo(() => {
    const start = Math.max(Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN, 0);
    const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT) + OVERSCAN * 2;
    const end = Math.min(start + visibleCount, ayahs.length);

    return {
      startIndex: start,
      endIndex: end,
      totalHeight: ayahs.length * ROW_HEIGHT,
    };
  }, [ayahs.length, scrollTop]);

  const visibleRows = ayahs.slice(startIndex, endIndex);

  return (
    <div
      className={styles.container}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div className={styles.spacer} style={{ height: totalHeight }}>
        {visibleRows.map((ayah, index) => {
          const offset = (startIndex + index) * ROW_HEIGHT;

          return (
            <article key={ayah.numberInSurah} className={styles.row} style={{ top: offset }}>
              <strong>Ayah {ayah.numberInSurah}</strong>
              <p className={styles.arabic}>{ayah.arabic}</p>
              <p className={styles.translation}>{ayah.translation}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
