"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, RotateCcw, Trash2, X } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { playCompletionSound, vibrateOnTap } from "@/lib/tasbeeh-utils";
import styles from "./page.module.css";

type Dhikr = {
  id: string;
  arabic: string;
  transliterationEn: string;
  transliterationTh: string;
  targets: number[];
  custom?: true;
};

const PRESET_DHIKR: Dhikr[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    transliterationEn: "SubhanAllah",
    transliterationTh: "ซุบฮานัลลอฮ์",
    targets: [33, 100, 1000],
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliterationEn: "Alhamdulillah",
    transliterationTh: "อัลฮัมดุลิลลาฮ์",
    targets: [33, 100, 1000],
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    transliterationEn: "Allahu Akbar",
    transliterationTh: "อัลลอฮุอักบัร",
    targets: [33, 100, 1000],
  },
  {
    id: "lailahaillallah",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliterationEn: "La ilaha illAllah",
    transliterationTh: "ลาอิลาฮะอิลลัลลอฮ์",
    targets: [100, 1000],
  },
  {
    id: "astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    transliterationEn: "Astaghfirullah",
    transliterationTh: "อัสตัฆฟิรุลลอฮ์",
    targets: [33, 100, 1000],
  },
];

type StoredCounts = Record<string, number>;

const COUNTS_KEY = "tasbeeh-counts";
const CUSTOM_KEY = "tasbeeh-custom";

const CUSTOM_TARGETS = [33, 100, 500, 1000];

function makeId() {
  return "custom-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export default function TasbeehPage() {
  const { t, locale } = useI18n();
  const [storedCounts, setStoredCounts] = useLocalStorage<StoredCounts>(COUNTS_KEY, {});
  const [customDhikr, setCustomDhikr] = useLocalStorage<Dhikr[]>(CUSTOM_KEY, []);
  const [activeDhikrId, setActiveDhikrId] = useState(PRESET_DHIKR[0]!.id);
  const [targetIndex, setTargetIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Add form state
  const [formArabic, setFormArabic] = useState("");
  const [formTranslit, setFormTranslit] = useState("");
  const [formTarget, setFormTarget] = useState(33);

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allDhikr = useMemo<Dhikr[]>(() => [...PRESET_DHIKR, ...customDhikr], [customDhikr]);

  const dhikr = useMemo(
    () => allDhikr.find((d) => d.id === activeDhikrId) ?? allDhikr[0]!,
    [allDhikr, activeDhikrId],
  );

  const count = storedCounts[activeDhikrId] ?? 0;
  const target = dhikr.targets[targetIndex] ?? dhikr.targets[0]!;
  const progress = Math.min(count / target, 1);

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const handleTap = useCallback(() => {
    const current = storedCounts[activeDhikrId] ?? 0;
    const newCount = current + 1;
    setStoredCounts({ ...storedCounts, [activeDhikrId]: newCount });
    vibrateOnTap();
    if (newCount === target) {
      playCompletionSound();
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlash(true);
      flashTimer.current = setTimeout(() => setFlash(false), 600);
    }
  }, [storedCounts, activeDhikrId, target, setStoredCounts]);

  const handleReset = useCallback(() => {
    setStoredCounts({ ...storedCounts, [activeDhikrId]: 0 });
  }, [storedCounts, activeDhikrId, setStoredCounts]);

  const handleDhikrChange = (id: string) => {
    setActiveDhikrId(id);
    setTargetIndex(0);
  };

  function handleAddCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!formArabic.trim()) return;
    const newDhikr: Dhikr = {
      id: makeId(),
      arabic: formArabic.trim(),
      transliterationEn: formTranslit.trim() || formArabic.trim(),
      transliterationTh: formTranslit.trim() || formArabic.trim(),
      targets: [formTarget],
      custom: true,
    };
    setCustomDhikr([...customDhikr, newDhikr]);
    setFormArabic("");
    setFormTranslit("");
    setFormTarget(33);
    setShowAddForm(false);
    // Switch to the new dhikr
    setActiveDhikrId(newDhikr.id);
    setTargetIndex(0);
  }

  function handleDeleteCustom(id: string) {
    setCustomDhikr(customDhikr.filter((d) => d.id !== id));
    // Remove its count
    const updated = { ...storedCounts };
    delete updated[id];
    setStoredCounts(updated);
    // Switch to first preset if active
    if (activeDhikrId === id) {
      setActiveDhikrId(PRESET_DHIKR[0]!.id);
      setTargetIndex(0);
    }
    setDeleteConfirmId(null);
  }

  return (
    <div className={styles.page}>
      {/* Dhikr selector */}
      <div className={styles.selector}>
        {allDhikr.map((d) => (
          <div key={d.id} className={styles.selectorItem}>
            <button
              type="button"
              className={`${styles.selectorBtn} ${d.id === activeDhikrId ? styles.selectorBtnActive : ""}`}
              onClick={() => handleDhikrChange(d.id)}
            >
              {locale === "th" ? d.transliterationTh : d.transliterationEn}
            </button>
            {d.custom && (
              <button
                type="button"
                className={styles.deleteCustomBtn}
                onClick={() => setDeleteConfirmId(d.id)}
                aria-label={t("tasbeeh.deleteCustom")}
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className={styles.addCustomBtn}
          onClick={() => setShowAddForm(true)}
          aria-label={t("tasbeeh.addCustom")}
        >
          <Plus size={14} />
          {t("tasbeeh.addCustom")}
        </button>
      </div>

      {/* Target selector */}
      <div className={styles.targets}>
        {dhikr.targets.map((tgt, i) => (
          <button
            key={tgt}
            type="button"
            className={`${styles.targetBtn} ${i === targetIndex ? styles.targetBtnActive : ""}`}
            onClick={() => setTargetIndex(i)}
          >
            {tgt}
          </button>
        ))}
      </div>

      {/* Main tap zone */}
      <button
        type="button"
        className={`${styles.tapZone} ${flash ? styles.tapZoneFlash : ""}`}
        onClick={handleTap}
        aria-label={t("tasbeeh.tap")}
      >
        <p className={styles.arabic}>{dhikr.arabic}</p>
        <p className={styles.translit}>
          {locale === "th" ? dhikr.transliterationTh : dhikr.transliterationEn}
        </p>
        <p className={styles.counter}>{count.toLocaleString()}</p>
        <p className={styles.target}>/ {target.toLocaleString()}</p>
      </button>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>
        {count >= target && <p className={styles.completedMsg}>{t("tasbeeh.completed")}</p>}
      </div>

      {/* Reset */}
      <button type="button" className={styles.resetBtn} onClick={handleReset}>
        <RotateCcw size={14} />
        {t("tasbeeh.reset")}
      </button>

      {/* Add Custom Modal */}
      {showAddForm && (
        <>
          <div className={styles.backdrop} onClick={() => setShowAddForm(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{t("tasbeeh.addCustom")}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowAddForm(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCustom} className={styles.addForm}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel} htmlFor="ta-arabic">
                  {t("tasbeeh.fieldArabic")}
                </label>
                <input
                  id="ta-arabic"
                  type="text"
                  className={`${styles.fieldInput} ${styles.fieldArabic}`}
                  value={formArabic}
                  onChange={(e) => setFormArabic(e.target.value)}
                  placeholder="اللَّهُمَّ صَلِّ عَلَى مُحَمَّد"
                  dir="rtl"
                  required
                  autoFocus
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel} htmlFor="ta-translit">
                  {t("tasbeeh.fieldTranslit")}
                  <span className={styles.fieldHint}>{t("tasbeeh.optional")}</span>
                </label>
                <input
                  id="ta-translit"
                  type="text"
                  className={styles.fieldInput}
                  value={formTranslit}
                  onChange={(e) => setFormTranslit(e.target.value)}
                  placeholder="Allahumma salli 'ala Muhammad"
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>{t("tasbeeh.fieldTarget")}</label>
                <div className={styles.targetGrid}>
                  {CUSTOM_TARGETS.map((tgt) => (
                    <button
                      key={tgt}
                      type="button"
                      className={`${styles.targetBtn} ${formTarget === tgt ? styles.targetBtnActive : ""}`}
                      onClick={() => setFormTarget(tgt)}
                    >
                      {tgt}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAddForm(false)}
                >
                  {t("tasbeeh.cancel")}
                </button>
                <button type="submit" className={styles.saveBtn} disabled={!formArabic.trim()}>
                  {t("tasbeeh.save")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteConfirmId && (
        <>
          <div className={styles.backdrop} onClick={() => setDeleteConfirmId(null)} />
          <div className={styles.confirmModal} role="dialog" aria-modal="true">
            <p className={styles.confirmText}>{t("tasbeeh.confirmDelete")}</p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setDeleteConfirmId(null)}
              >
                {t("tasbeeh.cancel")}
              </button>
              <button
                type="button"
                className={styles.deleteConfirmBtn}
                onClick={() => handleDeleteCustom(deleteConfirmId)}
              >
                {t("tasbeeh.delete")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
