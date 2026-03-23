"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";
import enDuas from "./en.json";
import thDuas from "./th.json";

type JsonDua = {
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  notes: string | null;
  benefits?: string;
  fawaid?: string;
  source: string;
};

function getSourceLabel(source: string) {
  return source.startsWith("QS.") ? "Quran" : "Hadith";
}

function getMorningEveningPriority(source: string): number {
  if (source.startsWith("QS. Al-Baqarah: 255")) return 1; // Ayat al-Kursi
  if (source.startsWith("QS. Al-Ikhlas:")) return 2;
  if (source.startsWith("QS. Al-Falaq:")) return 3;
  if (source.startsWith("QS. An-Nas:")) return 4;
  return 999;
}

function getDuaCategories(englishTitle: string, source: string): string[] {
  const cats: string[] = [];
  const t = englishTitle.toLowerCase();

  if (source.startsWith("QS.")) cats.push("quran");

  // Morning & Evening — by title keyword
  if (t.includes("morning") || t.includes("evening")) cats.push("morningEvening");

  // Upon Waking Up
  if (t.includes("waking up") || t.includes("upon waking")) cats.push("wakingUp");
  // Morning & Evening — specific well-known Quran adhkar recited morning/evening
  if (
    source.startsWith("QS. Al-Fatiha:") ||
    source.startsWith("QS. Al-Baqarah: 255") ||
    source.startsWith("QS. Al-Baqarah: 285") ||
    source.startsWith("QS. At-Tawbah: 129") ||
    source.startsWith("QS. Al-Hashr: 22") ||
    source.startsWith("QS. Al-Ikhlas:") ||
    source.startsWith("QS. Al-Falaq:") ||
    source.startsWith("QS. An-Nas:")
  )
    cats.push("morningEvening");
  // Sayyid al-Istighfar — explicitly recommended for morning and evening
  if (t.includes("sayyid al-istighfar")) cats.push("morningEvening");

  // Before Sleep / Dreams
  if (
    t.includes("sleeping") ||
    t.includes("dream") ||
    t.includes("nightmare") ||
    source.startsWith("QS. Al-Baqarah: 255")
  )
    cats.push("sleep");

  if (
    t.includes("after each") ||
    t.includes("after fajr") ||
    t.includes("after maghrib") ||
    t.includes("obligatory prayer") ||
    t.includes("iqamah")
  )
    cats.push("afterPrayer");
  if (t.includes("mosque") || t.includes("masjid") || t.includes("istikharah"))
    cats.push("general");
  if (
    t.includes("physical pain") ||
    t.includes("visiting the sick") ||
    t.includes("disease") ||
    t.includes("healing") ||
    t.includes("the sick") ||
    t.includes("illness") ||
    t.includes("suffering") ||
    source.startsWith("QS. Al-Fatiha:") // Al-Fatiha is a ruqyah (healing)
  )
    cats.push("health");
  if (
    t.includes("grief") ||
    t.includes("anxiety") ||
    t.includes("calamity") ||
    t.includes("debt") ||
    t.includes("sadness") ||
    t.includes("overpowered") ||
    t.includes("suffering") ||
    t.includes("belly of the whale") ||
    t.includes("corrupt people") ||
    t.includes("judge with truth")
  )
    cats.push("hardship");

  if (
    t.includes("start of prayer") ||
    t.includes("iftitah") ||
    t.includes("opening supplication at")
  )
    cats.push("afterPrayer");

  if (cats.length === 0) cats.push("daily");
  return cats;
}

const EN_DUAS = enDuas as JsonDua[];

export default function DuasPage() {
  const { t, locale } = useI18n();
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  const rawData = locale === "th" ? (thDuas as JsonDua[]) : EN_DUAS;

  const items = useMemo(() => {
    return rawData
      .map((dua, i) => ({
        dua,
        cats: getDuaCategories(EN_DUAS[i].title, EN_DUAS[i].source),
        idx: i,
      }))
      .filter(({ cats }) => !category || cats.includes(category))
      .filter(({ dua }) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          dua.title.toLowerCase().includes(q) ||
          dua.translation.toLowerCase().includes(q) ||
          dua.arabic.includes(q) ||
          dua.latin.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (category === "morningEvening") {
          const pa = getMorningEveningPriority(EN_DUAS[a.idx].source);
          const pb = getMorningEveningPriority(EN_DUAS[b.idx].source);
          if (pa !== pb) return pa - pb;
        }
        return a.idx - b.idx;
      })
      .map(({ dua }) => dua);
  }, [rawData, category, query]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(inputQuery);
    setCategory(inputCategory);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>{t("duas.title")}</h1>
        <p>{t("duas.subtitle")}</p>

        <form className={styles.filters} onSubmit={handleSubmit}>
          <input
            name="q"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t("duas.searchPlaceholder")}
          />
          <select
            name="category"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
          >
            <option value="">{t("duas.allCategories")}</option>
            <option value="morningEvening">{t("duas.category.morningEvening")}</option>
            <option value="wakingUp">{t("duas.category.wakingUp")}</option>
            <option value="sleep">{t("duas.category.sleep")}</option>
            <option value="afterPrayer">{t("duas.category.afterPrayer")}</option>
            <option value="general">{t("duas.category.general")}</option>
            <option value="health">{t("duas.category.health")}</option>
            <option value="hardship">{t("duas.category.hardship")}</option>
            <option value="quran">{t("duas.category.quran")}</option>
            <option value="daily">{t("duas.category.daily")}</option>
          </select>
          <button type="submit">{t("duas.filter")}</button>
        </form>
      </section>

      <section className={styles.list}>
        {items.length === 0 ? <p>{t("duas.noResults")}</p> : null}

        {items.map((dua, i) => (
          <article key={i} className={styles.card}>
            <div className={styles.meta}>{getSourceLabel(dua.source)}</div>
            <h2>{dua.title}</h2>
            <p className={styles.arabic}>{dua.arabic}</p>
            {dua.latin ? <p className={styles.translit}>{dua.latin}</p> : null}
            <p>{dua.translation}</p>
            {dua.notes ? <p className={styles.notes}>{dua.notes}</p> : null}
            {(dua.benefits ?? dua.fawaid) ? (
              <p className={styles.benefits}>{dua.benefits ?? dua.fawaid}</p>
            ) : null}
            <p className={styles.source}>{dua.source}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
