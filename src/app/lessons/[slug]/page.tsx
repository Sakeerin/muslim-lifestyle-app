import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedLessonBySlug } from "@/lib/dynamic-content";
import styles from "./page.module.css";

type LessonDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function toParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { slug } = await params;
  const lesson = await getPublishedLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const paragraphs = toParagraphs(lesson.content);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Link href="/lessons" className={styles.back}>
          Back to lessons
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
