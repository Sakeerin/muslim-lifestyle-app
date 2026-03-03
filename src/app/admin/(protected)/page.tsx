import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";

async function getDashboardStats() {
  try {
    const [totalLessons, totalDuas, totalPlaces, totalVerifiedPlaces] = await Promise.all([
      prisma.lesson.count(),
      prisma.dua.count(),
      prisma.place.count(),
      prisma.place.count({ where: { isVerified: true } }),
    ]);

    return {
      totalLessons,
      totalDuas,
      totalPlaces,
      totalVerifiedPlaces,
    };
  } catch {
    return {
      totalLessons: 0,
      totalDuas: 0,
      totalPlaces: 0,
      totalVerifiedPlaces: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Overview of published content and local place records.</p>
        </div>
      </header>

      <section className={styles.cardGrid}>
        <article className={styles.statCard}>
          <p>Total lessons</p>
          <strong>{stats.totalLessons}</strong>
        </article>
        <article className={styles.statCard}>
          <p>Total duas</p>
          <strong>{stats.totalDuas}</strong>
        </article>
        <article className={styles.statCard}>
          <p>Total places</p>
          <strong>{stats.totalPlaces}</strong>
        </article>
        <article className={styles.statCard}>
          <p>Verified places</p>
          <strong>{stats.totalVerifiedPlaces}</strong>
        </article>
      </section>

      <section style={{ marginTop: "1rem" }}>
        <p>Quick actions</p>
        <div className={styles.actions} style={{ marginTop: "0.55rem" }}>
          <Link href="/admin/lessons/new" className={styles.linkButton}>
            New lesson
          </Link>
          <Link href="/admin/duas/new" className={styles.linkButton}>
            New dua
          </Link>
          <Link href="/admin/places" className={styles.linkButton}>
            Add place
          </Link>
        </div>
      </section>
    </div>
  );
}
