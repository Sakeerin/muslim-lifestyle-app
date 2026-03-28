"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { ALLAH_NAMES } from "@/data/allah-names";
import styles from "./page.module.css";

export default function NamesPage() {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALLAH_NAMES;
    return ALLAH_NAMES.filter(
      (n) =>
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.meaningTh.includes(q) ||
        n.arabic.includes(q) ||
        String(n.number) === q,
    );
  }, [query]);

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
      </header>

      <section className={styles.listWrap}>
        {filtered.length === 0 ? (
          <p className={styles.noResult}>{t("names.noResult")}</p>
        ) : (
          <ul className={styles.list}>
            {filtered.map((name) => (
              <li key={name.number} className={styles.item}>
                <span className={styles.number}>{name.number}</span>
                <div className={styles.info}>
                  <p className={styles.transliteration}>{name.transliteration}</p>
                  <p className={styles.meaning}>
                    {locale === "th" ? name.meaningTh : name.meaning}
                  </p>
                </div>
                <p className={styles.arabic} lang="ar" dir="rtl">
                  {name.arabic}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
