"use client";

import { useMemo, useState } from "react";
import { Heart, Search } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ALLAH_NAMES } from "@/data/allah-names";
import styles from "./page.module.css";

const FAVORITES_KEY = "allah-names-favorites";

export default function NamesPage() {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<number[]>(FAVORITES_KEY, []);

  const toggleFav = (num: number) => {
    setFavorites((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num],
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = ALLAH_NAMES;
    if (showFavOnly) list = list.filter((n) => favorites.includes(n.number));
    if (!q) return list;
    return list.filter(
      (n) =>
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.meaningTh.includes(q) ||
        n.arabic.includes(q) ||
        String(n.number) === q,
    );
  }, [query, showFavOnly, favorites]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <p className={styles.headerSub}>{t("names.subtitle")}</p>
          <h1 className={styles.headerTitle}>{t("names.title")}</h1>
          <p className={styles.headerCount}>{t("names.count", { count: "99" })}</p>
        </div>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="search"
            placeholder={t("names.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterRow}>
          <button
            type="button"
            className={`${styles.filterBtn} ${!showFavOnly ? styles.filterBtnActive : ""}`}
            onClick={() => setShowFavOnly(false)}
          >
            {t("names.allNames")}
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${showFavOnly ? styles.filterBtnActive : ""}`}
            onClick={() => setShowFavOnly(true)}
          >
            <Heart size={13} />
            {t("names.favoritesOnly")}
            {favorites.length > 0 && (
              <span className={styles.favCount}>{favorites.length}</span>
            )}
          </button>
        </div>
      </header>

      <section className={styles.listWrap}>
        {filtered.length === 0 ? (
          <p className={styles.noResult}>{t("names.noResult")}</p>
        ) : (
          <ul className={styles.list}>
            {filtered.map((name) => {
              const isFav = favorites.includes(name.number);
              return (
                <li key={name.number} className={`${styles.item} ${isFav ? styles.itemFav : ""}`}>
                  <span className={styles.number}>{name.number}</span>
                  <div className={styles.info}>
                    <p className={styles.transliteration}>{name.transliteration}</p>
                    <p className={styles.meaning}>
                      {locale === "th" ? name.meaningTh : name.meaning}
                    </p>
                  </div>
                  <div className={styles.itemRight}>
                    <p className={styles.arabic} lang="ar" dir="rtl">
                      {name.arabic}
                    </p>
                    <button
                      type="button"
                      className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ""}`}
                      onClick={() => toggleFav(name.number)}
                      aria-label={t("names.favorite")}
                      aria-pressed={isFav}
                    >
                      <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
