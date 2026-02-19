import Link from "next/link";
import { listPublishedLessons } from "@/lib/dynamic-content";
import styles from "./page.module.css";

type LessonsPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    q?: string;
  }>;
};

function parseNumber(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

function pageHref(page: number, category?: string, q?: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));

  if (category) {
    params.set("category", category);
  }

  if (q) {
    params.set("q", q);
  }

  return `/lessons?${params.toString()}`;
}

export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  const filters = await searchParams;
  const page = parseNumber(filters.page, 1, 1, 1000);
  const limit = parseNumber(filters.limit, 9, 1, 24);
  const category = filters.category?.trim() || undefined;
  const q = filters.q?.trim() || undefined;
  const { items, total } = await listPublishedLessons({ page, limit, category, q });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Islamic Lessons</h1>
        <p>Read short, practical lessons on Quran, seerah, and character building.</p>

        <form className={styles.filters} method="get">
          <input name="q" defaultValue={q} placeholder="Search lessons" />
          <input name="category" defaultValue={category} placeholder="Category" />
          <button type="submit">Apply</button>
        </form>
      </section>

      <section className={styles.list}>
        {items.length === 0 ? <p>No lessons matched your search.</p> : null}

        {items.map((lesson) => (
          <article key={lesson.id} className={styles.card}>
            <div className={styles.meta}>
              <span>{lesson.category}</span>
              <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
            </div>
            <h2>{lesson.title}</h2>
            <p>{lesson.excerpt}</p>
            <Link href={`/lessons/${lesson.slug}`}>Read lesson</Link>
          </article>
        ))}
      </section>

      <section className={styles.pagination}>
        <Link
          href={pageHref(Math.max(1, page - 1), category, q)}
          aria-disabled={page <= 1}
          className={page <= 1 ? styles.disabled : ""}
        >
          Previous
        </Link>
        <p>
          Page {Math.min(page, totalPages)} of {totalPages}
        </p>
        <Link
          href={pageHref(Math.min(totalPages, page + 1), category, q)}
          aria-disabled={page >= totalPages}
          className={page >= totalPages ? styles.disabled : ""}
        >
          Next
        </Link>
      </section>
    </div>
  );
}
