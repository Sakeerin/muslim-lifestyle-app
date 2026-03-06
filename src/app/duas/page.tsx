"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

type DuaItem = {
  id: string;
  title: string;
  arabic: string;
  transliteration: string | null;
  translation: string;
  category: string;
};

type DuaResponse = {
  data: DuaItem[];
  meta: {
    total: number;
    categories: string[];
  };
};

export default function DuasPage() {
  const { t } = useI18n();
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<DuaItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDuas() {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (query) params.set("q", query);

      try {
        const response = await fetch(`/api/duas?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to load");
        const data = (await response.json()) as DuaResponse;
        if (!mounted) return;
        setItems(data.data);
        setCategories(data.meta.categories);
      } catch {
        if (!mounted) return;
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadDuas();

    return () => {
      mounted = false;
    };
  }, [category, query]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setQuery(formData.get("q")?.toString().trim() || "");
    setCategory(formData.get("category")?.toString().trim() || "");
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>{t("duas.title")}</h1>
        <p>{t("duas.subtitle")}</p>

        <form className={styles.filters} onSubmit={handleSubmit}>
          <input name="q" defaultValue={query} placeholder={t("duas.searchPlaceholder")} />
          <select name="category" defaultValue={category}>
            <option value="">{t("duas.allCategories")}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="submit">{t("duas.filter")}</button>
        </form>
      </section>

      <section className={styles.list}>
        {!loading && items.length === 0 ? <p>{t("duas.noResults")}</p> : null}

        {items.map((dua) => (
          <article key={dua.id} className={styles.card}>
            <div className={styles.meta}>{dua.category}</div>
            <h2>{dua.title}</h2>
            <p className={styles.arabic}>{dua.arabic}</p>
            {dua.transliteration ? <p className={styles.translit}>{dua.transliteration}</p> : null}
            <p>{dua.translation}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
