"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

type LessonDetail = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
};

type LessonDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function toParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export default function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { t } = useI18n();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadLesson() {
      const { slug } = await params;

      try {
        const response = await fetch(`/api/lessons/${slug}`);
        if (!response.ok) {
          if (mounted) setNotFound(true);
          return;
        }

        const result = (await response.json()) as { data: LessonDetail };
        if (!mounted) return;
        setLesson(result.data);
      } catch {
        if (mounted) setNotFound(true);
      }
    }

    void loadLesson();
    return () => { mounted = false; };
  }, [params]);

  if (notFound) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <Link href="/lessons" className={styles.back}>{t("lessons.backToLessons")}</Link>
          <h1>{t("lessons.noResults")}</h1>
        </section>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  const paragraphs = toParagraphs(lesson.content);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Link href="/lessons" className={styles.back}>
          {t("lessons.backToLessons")}
        </Link>
        <p>{lesson.category}</p>
        <h1>{lesson.title}</h1>
        <p>{new Date(lesson.createdAt).toLocaleDateString()}</p>
      </section>

      <article className={styles.content}>
        {paragraphs.length > 0
          ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          : lesson.content}
      </article>
    </div>
  );
}
