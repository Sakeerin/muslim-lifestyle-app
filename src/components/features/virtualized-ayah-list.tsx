"use client";

import { useState } from "react";
import { Bookmark, NotebookPen, X } from "lucide-react";
import type { MemoStatus } from "@/hooks/use-quran-memorization";
import styles from "./virtualized-ayah-list.module.css";

export type AyahView = {
  numberInSurah: number;
  arabic: string;
  translation: string;
};

type VirtualizedAyahListProps = {
  ayahs: AyahView[];
  mode?: "compact" | "reading";
  showTranslation?: boolean;
  surahNumber?: number;
  surahNameEn?: string;
  surahNameAr?: string;
  fontSize?: "sm" | "md" | "lg";
  bookmarkedAyahs?: number[];
  onToggleBookmark?: (ayahNumber: number) => void;
  memoStatuses?: Record<number, MemoStatus>;
  onCycleMemo?: (ayahNumber: number) => void;
  ayahNotes?: Record<number, string>;
  onSaveNote?: (ayahNumber: number, text: string) => void;
  notePlaceholder?: string;
  noteSaveLabel?: string;
  noteCancelLabel?: string;
  noteDeleteLabel?: string;
};

const MEMO_LABELS: Record<MemoStatus, string> = {
  learning: "📖",
  memorized: "✅",
};

export function VirtualizedAyahList({
  ayahs,
  mode = "reading",
  showTranslation = true,
  surahNumber,
  surahNameEn,
  surahNameAr,
  fontSize = "md",
  bookmarkedAyahs = [],
  onToggleBookmark,
  memoStatuses = {},
  onCycleMemo,
  ayahNotes = {},
  onSaveNote,
  notePlaceholder = "Write a note...",
  noteSaveLabel = "Save",
  noteCancelLabel = "Cancel",
  noteDeleteLabel = "Delete Note",
}: VirtualizedAyahListProps) {
  const isCompact = mode === "compact";
  const fontSizeClass = fontSize === "sm" ? styles.fontSm : fontSize === "lg" ? styles.fontLg : "";

  // Active note editor: ayah number or null
  const [noteEditing, setNoteEditing] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  function openNote(ayahNum: number) {
    setNoteEditing(ayahNum);
    setNoteDraft(ayahNotes[ayahNum] ?? "");
  }

  function saveNote(ayahNum: number) {
    onSaveNote?.(ayahNum, noteDraft);
    setNoteEditing(null);
  }

  function deleteNote(ayahNum: number) {
    onSaveNote?.(ayahNum, "");
    setNoteEditing(null);
  }

  return (
    <div
      className={`${styles.container} ${isCompact ? styles.compactContainer : styles.readingContainer} ${fontSizeClass}`}
    >
      {ayahs.map((ayah) => {
        const isBookmarked = bookmarkedAyahs.includes(ayah.numberInSurah);
        const memoStatus = memoStatuses[ayah.numberInSurah] ?? null;
        const note = ayahNotes[ayah.numberInSurah] ?? "";
        const hasNote = note.length > 0;
        const isEditingNote = noteEditing === ayah.numberInSurah;

        return (
          <article
            key={ayah.numberInSurah}
            className={`${styles.row} ${isCompact ? styles.compactRow : styles.readingRow} ${memoStatus === "memorized" ? styles.rowMemorized : memoStatus === "learning" ? styles.rowLearning : ""}`}
          >
            <div className={styles.ayahHeader}>
              <div className={styles.ayahBadge}>
                <span className={styles.ayahRef}>
                  {surahNumber ?? "—"}:{ayah.numberInSurah}
                </span>
                {surahNameEn && (
                  <span className={styles.ayahNames}>
                    <span className={styles.ayahNameEn}>{surahNameEn}</span>
                    {surahNameAr && <span className={styles.ayahNameAr}>{surahNameAr}</span>}
                  </span>
                )}
              </div>
              <div className={styles.ayahActions}>
                {onCycleMemo && (
                  <button
                    type="button"
                    className={`${styles.memoBtn} ${memoStatus ? styles[`memoBtnStatus_${memoStatus}`] : ""}`}
                    onClick={() => onCycleMemo(ayah.numberInSurah)}
                    aria-label={`Memorization: ${memoStatus ?? "none"}`}
                    title={`Memorization: ${memoStatus ?? "none"} — tap to cycle`}
                  >
                    {memoStatus ? MEMO_LABELS[memoStatus] : "○"}
                  </button>
                )}
                {onSaveNote && (
                  <button
                    type="button"
                    className={`${styles.noteBtn} ${hasNote ? styles.noteBtnActive : ""}`}
                    onClick={() => openNote(ayah.numberInSurah)}
                    aria-label={hasNote ? "Edit note" : "Add note"}
                    title={hasNote ? "Edit note" : "Add note"}
                  >
                    <NotebookPen size={13} />
                  </button>
                )}
                {onToggleBookmark && (
                  <button
                    type="button"
                    className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarkBtnActive : ""}`}
                    onClick={() => onToggleBookmark(ayah.numberInSurah)}
                    aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    aria-pressed={isBookmarked}
                  >
                    <Bookmark size={13} />
                  </button>
                )}
              </div>
            </div>
            <p
              className={`${styles.arabic} ${isCompact ? styles.compactArabic : styles.readingArabic}`}
            >
              {ayah.arabic}
            </p>
            {showTranslation && (
              <p
                className={`${styles.translation} ${isCompact ? styles.compactTranslation : styles.readingTranslation}`}
              >
                {ayah.translation}
              </p>
            )}

            {/* Existing note display */}
            {hasNote && !isEditingNote && (
              <div className={styles.noteDisplay}>
                <NotebookPen size={11} className={styles.noteDisplayIcon} />
                <p className={styles.noteText}>{note}</p>
              </div>
            )}

            {/* Note editor */}
            {isEditingNote && (
              <div className={styles.noteEditor}>
                <textarea
                  className={styles.noteTextarea}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder={notePlaceholder}
                  rows={3}
                  autoFocus
                />
                <div className={styles.noteActions}>
                  {hasNote && (
                    <button
                      type="button"
                      className={styles.noteDeleteBtn}
                      onClick={() => deleteNote(ayah.numberInSurah)}
                    >
                      {noteDeleteLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.noteCancelBtn}
                    onClick={() => setNoteEditing(null)}
                  >
                    <X size={13} />
                    {noteCancelLabel}
                  </button>
                  <button
                    type="button"
                    className={styles.noteSaveBtn}
                    onClick={() => saveNote(ayah.numberInSurah)}
                  >
                    {noteSaveLabel}
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
