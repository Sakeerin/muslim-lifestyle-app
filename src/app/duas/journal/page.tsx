"use client";

import { useState } from "react";
import { BookHeart, Plus, Trash2, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

export type DuaEntry = {
  id: string;
  title: string;
  text: string;
  notes: string;
  tag: string;
  createdAt: string; // ISO date string
};

const STORAGE_KEY = "dua-journal";

const TAGS = [
  "general",
  "personal",
  "family",
  "health",
  "work",
  "gratitude",
  "forgiveness",
  "travel",
] as const;

type Tag = (typeof TAGS)[number];

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function DuaJournalPage() {
  const { t, locale } = useI18n();
  const [entries, setEntries] = useLocalStorage<DuaEntry[]>(STORAGE_KEY, []);
  const [showForm, setShowForm] = useState(false);
  const [filterTag, setFilterTag] = useState<Tag | "all">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState<Tag>("general");

  const filtered = filterTag === "all" ? entries : entries.filter((e) => e.tag === filterTag);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    const entry: DuaEntry = {
      id: makeId(),
      title: title.trim(),
      text: text.trim(),
      notes: notes.trim(),
      tag,
      createdAt: new Date().toISOString(),
    };
    setEntries([entry, ...entries]);
    setTitle("");
    setText("");
    setNotes("");
    setTag("general");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
    setDeleteId(null);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return locale === "th"
      ? d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
      : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerIcon}>
          <BookHeart size={24} />
        </div>
        <div>
          <h1>{t("journal.title")}</h1>
          <p>{t("journal.subtitle")}</p>
        </div>
      </section>

      {/* Add button */}
      <button type="button" className={styles.addBtn} onClick={() => setShowForm(true)}>
        <Plus size={16} />
        {t("journal.addDua")}
      </button>

      {/* Add form modal */}
      {showForm && (
        <>
          <div className={styles.backdrop} onClick={() => setShowForm(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{t("journal.addDua")}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowForm(false)}
                aria-label={t("journal.close")}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className={styles.form}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel} htmlFor="dj-title">
                  {t("journal.fieldTitle")}
                </label>
                <input
                  id="dj-title"
                  type="text"
                  className={styles.fieldInput}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("journal.titlePlaceholder")}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel} htmlFor="dj-text">
                  {t("journal.fieldText")}
                </label>
                <textarea
                  id="dj-text"
                  className={`${styles.fieldInput} ${styles.fieldTextarea}`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("journal.textPlaceholder")}
                  required
                  rows={4}
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel} htmlFor="dj-notes">
                  {t("journal.fieldNotes")}
                  <span className={styles.fieldHint}>{t("journal.optional")}</span>
                </label>
                <input
                  id="dj-notes"
                  type="text"
                  className={styles.fieldInput}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("journal.notesPlaceholder")}
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>{t("journal.fieldTag")}</label>
                <div className={styles.tagGrid}>
                  {TAGS.map((tg) => (
                    <button
                      key={tg}
                      type="button"
                      className={`${styles.tagBtn} ${tag === tg ? styles.tagBtnActive : ""}`}
                      onClick={() => setTag(tg)}
                    >
                      {t(`journal.tag.${tg}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowForm(false)}
                >
                  {t("journal.cancel")}
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={!title.trim() || !text.trim()}
                >
                  {t("journal.save")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <>
          <div className={styles.backdrop} onClick={() => setDeleteId(null)} />
          <div className={styles.confirmModal} role="dialog" aria-modal="true">
            <p className={styles.confirmText}>{t("journal.confirmDelete")}</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setDeleteId(null)}>
                {t("journal.cancel")}
              </button>
              <button
                type="button"
                className={styles.deleteConfirmBtn}
                onClick={() => handleDelete(deleteId)}
              >
                {t("journal.delete")}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Tag filter */}
      {entries.length > 0 && (
        <div className={styles.filterRow}>
          <button
            type="button"
            className={`${styles.filterBtn} ${filterTag === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilterTag("all")}
          >
            {t("journal.all")} ({entries.length})
          </button>
          {(TAGS.filter((tg) => entries.some((e) => e.tag === tg)) as Tag[]).map((tg) => (
            <button
              key={tg}
              type="button"
              className={`${styles.filterBtn} ${filterTag === tg ? styles.filterBtnActive : ""}`}
              onClick={() => setFilterTag(tg)}
            >
              {t(`journal.tag.${tg}`)}
            </button>
          ))}
        </div>
      )}

      {/* Entry list */}
      {entries.length === 0 ? (
        <div className={styles.empty}>
          <BookHeart size={40} className={styles.emptyIcon} />
          <p className={styles.emptyText}>{t("journal.empty")}</p>
          <p className={styles.emptyHint}>{t("journal.emptyHint")}</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className={styles.emptyText}>{t("journal.noResults")}</p>
      ) : (
        <section className={styles.list}>
          {filtered.map((entry) => (
            <article key={entry.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardMeta}>
                  <span className={styles.tagPill}>{t(`journal.tag.${entry.tag}`)}</span>
                  <span className={styles.cardDate}>{formatDate(entry.createdAt)}</span>
                </div>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => setDeleteId(entry.id)}
                  aria-label={t("journal.delete")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h3 className={styles.cardTitle}>{entry.title}</h3>
              <p className={styles.cardText}>{entry.text}</p>
              {entry.notes && <p className={styles.cardNotes}>{entry.notes}</p>}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
