import { listDuas } from "@/lib/dynamic-content";
import styles from "./page.module.css";

type DuasPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
};

export default async function DuasPage({ searchParams }: DuasPageProps) {
  const filters = await searchParams;
  const category = filters.category?.trim() || undefined;
  const q = filters.q?.trim() || undefined;
  const { items, categories } = await listDuas({ category, q });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Duas</h1>
        <p>Hisn&apos;ul Muslim inspired duas with Arabic text and translation.</p>

        <form className={styles.filters} method="get">
          <input name="q" defaultValue={q} placeholder="Search dua title or text" />
          <select name="category" defaultValue={category ?? ""}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="submit">Filter</button>
        </form>
      </section>

      <section className={styles.list}>
        {items.length === 0 ? <p>No duas found for this filter.</p> : null}

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
