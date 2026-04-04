"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { searchQuran, type QuranSearchMatch } from "@/lib/api-clients/quran";
import styles from "./page.module.css";

type Surah = {
  number: number;
  englishName: string;
  englishNameTranslation: string;
  name: string;
  numberOfAyahs: number;
};

type SearchMode = "surah" | "keyword";

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<SearchMode>("surah");
  const [keywordQuery, setKeywordQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QuranSearchMatch[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchCount, setSearchCount] = useState<number | null>(null);
  const searchControllerRef = useRef<AbortController | null>(null);
  const { t, locale } = useI18n();

  const translationEdition = locale === "th" ? "th.thai" : "en.asad";

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function loadSurahs() {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah", {
          cache: "force-cache",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load surah index");
        const payload = (await response.json()) as { data: Surah[] };
        if (!mounted) return;
        setSurahs(payload.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (mounted) setSurahs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadSurahs();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return surahs;
    return surahs.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(normalizedQuery) ||
        surah.englishNameTranslation.toLowerCase().includes(normalizedQuery) ||
        surah.name.includes(query),
    );
  }, [query, surahs]);

  const handleKeywordSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const kw = keywordQuery.trim();
    if (!kw) return;

    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);
    setSearchCount(null);

    try {
      const result = await searchQuran(kw, translationEdition, controller.signal);
      setSearchResults(result.matches);
      setSearchCount(result.count);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setSearchError(t("quran.searchError"));
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>{t("quran.title")}</h1>
        <p>{t("quran.subtitle")}</p>
      </section>

      {/* Mode toggle */}
      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "surah" ? styles.modeBtnActive : ""}`}
          onClick={() => setMode("surah")}
        >
          {t("quran.modeSurah")}
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "keyword" ? styles.modeBtnActive : ""}`}
          onClick={() => setMode("keyword")}
        >
          {t("quran.modeKeyword")}
        </button>
      </div>

      {mode === "surah" ? (
        <>
          <section className={styles.card}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.search}
              placeholder={t("quran.searchPlaceholder")}
            />
          </section>
          <section className={styles.list}>
            {loading ? <p>{t("quran.loadingIndex")}</p> : null}
            {!loading && filtered.length === 0 ? <p>{t("quran.noSurah")}</p> : null}
            {filtered.map((surah) => (
              <Link key={surah.number} href={`/quran/${surah.number}`} className={styles.item}>
                <div>
                  <strong>
                    {surah.number}. {surah.englishName}
                  </strong>
                  <p>{surah.englishNameTranslation}</p>
                </div>
                <div>
                  <p className={styles.arabic}>{surah.name}</p>
                  <p>{t("quran.ayahs", { count: surah.numberOfAyahs })}</p>
                </div>
              </Link>
            ))}
          </section>
        </>
      ) : (
        <section className={styles.searchSection}>
          <form className={styles.keywordForm} onSubmit={(e) => void handleKeywordSearch(e)}>
            <input
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
              className={styles.search}
              placeholder={t("quran.keywordPlaceholder")}
              autoComplete="off"
            />
            <button type="submit" className={styles.searchBtn} disabled={searchLoading}>
              <Search size={16} />
            </button>
          </form>
          {searchLoading && <p className={styles.searchStatus}>{t("quran.searching")}</p>}
          {searchError && <p className={styles.searchError}>{searchError}</p>}
          {searchCount !== null && !searchLoading && (
            <p className={styles.searchStatus}>
              {t("quran.searchResults", { count: String(searchCount) })}
            </p>
          )}
          <div className={styles.list}>
            {searchResults.map((match) => (
              <Link
                key={match.number}
                href={`/quran/${match.surah.number}`}
                className={styles.searchItem}
              >
                <div className={styles.searchItemMeta}>
                  <span className={styles.searchSurahName}>
                    {match.surah.englishName} {match.surah.number}:{match.numberInSurah}
                  </span>
                  <span className={styles.searchSurahNameAr}>{match.surah.name}</span>
                </div>
                <p className={styles.searchItemText}>{match.text}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
