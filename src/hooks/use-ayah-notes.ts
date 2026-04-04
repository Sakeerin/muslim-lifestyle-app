"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

/** key = "${surah}:${ayah}", value = note text */
export type AyahNoteMap = Record<string, string>;

const STORAGE_KEY = "ayah-notes";

export function useAyahNotes() {
  const [notes, setNotes] = useLocalStorage<AyahNoteMap>(STORAGE_KEY, {});

  const getNote = useCallback(
    (surah: number, ayah: number): string => notes[`${surah}:${ayah}`] ?? "",
    [notes],
  );

  const setNote = useCallback(
    (surah: number, ayah: number, text: string) => {
      const key = `${surah}:${ayah}`;
      setNotes((prev) => {
        const updated = { ...prev };
        if (text.trim()) {
          updated[key] = text.trim();
        } else {
          delete updated[key];
        }
        return updated;
      });
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (surah: number, ayah: number) => {
      const key = `${surah}:${ayah}`;
      setNotes((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    },
    [setNotes],
  );

  /** All notes with surah/ayah parsed, for settings view */
  const allNotes = useCallback((): Array<{ surah: number; ayah: number; text: string }> => {
    return Object.entries(notes)
      .map(([k, text]) => {
        const [s, a] = k.split(":");
        return { surah: Number(s), ayah: Number(a), text };
      })
      .sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
  }, [notes]);

  const clearAll = useCallback(() => setNotes({}), [setNotes]);

  return { notes, getNote, setNote, deleteNote, allNotes, clearAll };
}
