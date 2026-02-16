"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    let mounted = true;

    async function loadSurahs() {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load surah index");
        }

        const payload = (await response.json()) as { data: Surah[] };

        if (!mounted) {
          return;
        }

        setSurahs(payload.data);
      } catch {
        if (mounted) {
          setSurahs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadSurahs();

    return () => {
      mounted = false;
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
        <h1>Quran Reader</h1>
        <p>Browse surahs with search and focused reading mode.</p>
      </section>

      <section className={styles.card}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={styles.search}
          placeholder="Search by surah name"
        />
      </section>

      <section className={styles.list}>
        {loading ? <p>Loading surah index...</p> : null}
        {!loading && filtered.length === 0 ? <p>No surah found.</p> : null}

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
              <p>{surah.numberOfAyahs} ayahs</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
