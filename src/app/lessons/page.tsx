"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

type LessonItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  createdAt: string;
};

type LessonsResponse = {
  data: LessonItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export default function LessonsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<LessonItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    let mounted = true;

    async function loadLessons() {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (category) params.set("category", category);
      if (query) params.set("q", query);

      try {
        const response = await fetch(`/api/lessons?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to load");
        const result = (await response.json()) as LessonsResponse;
        if (!mounted) return;
        setItems(result.data);
        setTotalPages(result.meta.totalPages);
      } catch {
        if (!mounted) return;
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadLessons();
    return () => { mounted = false; };
  }, [page, category, query]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setQuery(formData.get("q")?.toString().trim() || "");
    setCategory(formData.get("category")?.toString().trim() || "");
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>{t("lessons.title")}</h1>
        <p>{t("lessons.subtitle")}</p>

        <form className={styles.filters} onSubmit={handleSubmit}>
          <input name="q" defaultValue={query} placeholder={t("lessons.searchPlaceholder")} />
          <input name="category" defaultValue={category} placeholder={t("lessons.category")} />
          <button type="submit">{t("lessons.apply")}</button>
        </form>
      </section>

      <section className={styles.list}>
        {!loading && items.length === 0 ? <p>{t("lessons.noResults")}</p> : null}

        {items.map((lesson) => (
          <article key={lesson.id} className={styles.card}>
            <div className={styles.meta}>
              <span>{lesson.category}</span>
              <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
            </div>
            <h2>{lesson.title}</h2>
            <p>{lesson.excerpt}</p>
            <Link href={`/lessons/${lesson.slug}`}>{t("lessons.readLesson")}</Link>
          </article>
        ))}
      </section>

      <section className={styles.pagination}>
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className={page <= 1 ? styles.disabled : ""}
        >
          {t("lessons.previous")}
        </button>
        <p>{t("lessons.pageOf", { current: Math.min(page, totalPages), total: totalPages })}</p>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className={page >= totalPages ? styles.disabled : ""}
        >
          {t("lessons.next")}
        </button>
      </section>
    </div>
  );
}
