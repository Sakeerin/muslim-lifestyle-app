import { ThemeToggle } from "@/components/features/theme-toggle";
import styles from "./page.module.css";

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>Settings</h1>
        <p>Personalize prayer methods and app behavior.</p>
      </section>

      <section className={styles.card}>
        <h2>Appearance</h2>
        <ThemeToggle />
      </section>

      <section className={styles.card}>
        <h2>Upcoming options</h2>
        <div className={styles.list}>
          <div className={styles.item}>Prayer reminder schedules</div>
          <div className={styles.item}>Preferred reciter and playback speed</div>
          <div className={styles.item}>Quran reading progress sync</div>
        </div>
      </section>
    </div>
  );
}
