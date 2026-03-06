"use client";

import { ThemeToggle } from "@/components/features/theme-toggle";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

export default function SettingsPage() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>{t("settings.title")}</h1>
        <p>{t("settings.subtitle")}</p>
      </section>

      <section className={styles.card}>
        <h2>{t("settings.appearance")}</h2>
        <ThemeToggle />
      </section>

      <section className={styles.card}>
        <h2>{t("settings.language")}</h2>
        <div className={styles.list}>
          <button
            type="button"
            className={`${styles.item} ${locale === "en" ? styles.activeItem : ""}`}
            onClick={() => setLocale("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`${styles.item} ${locale === "th" ? styles.activeItem : ""}`}
            onClick={() => setLocale("th")}
          >
            ภาษาไทย (Thai)
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <h2>{t("settings.upcomingOptions")}</h2>
        <div className={styles.list}>
          <div className={styles.item}>{t("settings.prayerReminders")}</div>
          <div className={styles.item}>{t("settings.preferredReciter")}</div>
          <div className={styles.item}>{t("settings.quranSync")}</div>
        </div>
      </section>
    </div>
  );
}
