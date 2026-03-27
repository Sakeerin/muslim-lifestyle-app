"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

type Surah = {
  number: number;
  englishName: string;
  englishNameTranslation: string;
  name: string;
  numberOfAyahs: number;
};

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function loadSurahs() {
      try {
        // Surah list never changes — use browser cache
        const response = await fetch("https://api.alquran.cloud/v1/surah", {
          cache: "force-cache",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load surah index");
        }

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

    if (!normalizedQuery) {
      return surahs;
    }

    return surahs.filter((surah) => {
      return (
        surah.englishName.toLowerCase().includes(normalizedQuery) ||
        surah.englishNameTranslation.toLowerCase().includes(normalizedQuery) ||
        surah.name.includes(query)
      );
    });
  }, [query, surahs]);

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>{t("quran.title")}</h1>
        <p>{t("quran.subtitle")}</p>
      </section>

      <section className={styles.card}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
    </div>
  );
}
