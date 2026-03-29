"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, BookOpen, Star } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import {
  UMRAH_STEPS,
  HAJJ_DAYS,
  IMPORTANT_DUAS,
  type PilgrimageStep,
  type HajjDay,
  type PilgrimageDua,
  type StepBadge,
} from "@/data/hajj-umrah";
import styles from "./page.module.css";

type ActiveTab = "umrah" | "hajj" | "dua";

const BADGE_META: Record<StepBadge, { th: string; en: string; colorClass: string }> = {
  rukn: { th: "รุก่น", en: "Pillar", colorClass: styles.badgeRukn },
  wajib: { th: "วาญิบ", en: "Required", colorClass: styles.badgeWajib },
  sunnah: { th: "ซุนนะห์", en: "Sunnah", colorClass: styles.badgeSunnah },
};

// ── Sub-components ─────────────────────────────────────────────────────────

function StepCard({
  step,
  expanded,
  onToggle,
  locale,
}: {
  step: PilgrimageStep;
  expanded: boolean;
  onToggle: () => void;
  locale: string;
}) {
  const isTh = locale === "th";
  const badge = BADGE_META[step.badge];

  return (
    <div
      className={`${styles.stepCard} ${styles[`stepBorder${step.badge.charAt(0).toUpperCase()}${step.badge.slice(1)}`]}`}
    >
      <button
        className={styles.stepHeader}
        onClick={onToggle}
        type="button"
        aria-expanded={expanded}
        aria-controls={`${step.id}-body`}
      >
        <span className={styles.stepNumCircle}>{step.number}</span>
        <span className={styles.stepIcon}>{step.icon}</span>
        <div className={styles.stepNameWrap}>
          <span className={styles.stepNameAr} lang="ar" dir="rtl">
            {step.nameAr}
          </span>
          <span className={styles.stepNameLatin}>{isTh ? step.nameTh : step.nameEn}</span>
        </div>
        <span className={`${styles.badgePill} ${badge.colorClass}`}>
          {isTh ? badge.th : badge.en}
        </span>
        <span className={styles.chevron}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {expanded && (
        <div id={`${step.id}-body`} className={styles.stepBody}>
          <div className={styles.stepLocation}>
            <MapPin size={13} className={styles.locationIcon} />
            <span>{isTh ? step.locationTh : step.locationEn}</span>
          </div>

          <p className={styles.stepDesc}>{isTh ? step.descTh : step.descEn}</p>

          {step.actions.length > 0 && (
            <ul className={styles.actionList}>
              {step.actions.map((action, i) => (
                <li key={`${step.id}-action-${i}`} className={styles.actionItem}>
                  <span className={styles.actionCheck}>✓</span>
                  <span>{isTh ? action.th : action.en}</span>
                </li>
              ))}
            </ul>
          )}

          {step.prohibitions && step.prohibitions.length > 0 && (
            <>
              <p className={styles.prohibitionLabel}>
                {isTh ? "ข้อห้ามอิห์รอม" : "Ihram Prohibitions"}
              </p>
              <ul className={styles.prohibitionList}>
                {step.prohibitions.map((item, i) => (
                  <li key={`${step.id}-prohibition-${i}`} className={styles.prohibitionItem}>
                    <span className={styles.prohibitionX}>✕</span>
                    <span>{isTh ? item.th : item.en}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {(step.noteTh || step.noteEn) && (
            <div className={styles.noteBox}>
              <Star size={12} className={styles.noteIcon} />
              <span>{isTh ? step.noteTh : step.noteEn}</span>
            </div>
          )}

          {step.duaAr && (
            <div className={styles.duaBox}>
              <p className={styles.duaBoxArabic} lang="ar" dir="rtl">
                {step.duaAr}
              </p>
              {step.duaTransliteration && (
                <p className={styles.duaBoxTranslit}>{step.duaTransliteration}</p>
              )}
              {step.duaTransTh && isTh && <p className={styles.duaBoxTrans}>{step.duaTransTh}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DayCard({
  day,
  expandedSteps,
  onToggleStep,
  locale,
}: {
  day: HajjDay;
  expandedSteps: Set<string>;
  onToggleStep: (id: string) => void;
  locale: string;
}) {
  const isTh = locale === "th";

  return (
    <div className={styles.dayCard}>
      <div className={styles.dayHeader}>
        <span className={styles.dayDatePill}>{day.hijriDateTh}</span>
        <div className={styles.dayNameWrap}>
          <span className={styles.dayNameAr} lang="ar" dir="rtl">
            {day.nameAr}
          </span>
          <span className={styles.dayNameLatin}>{isTh ? day.nameTh : day.nameEn}</span>
        </div>
      </div>
      <p className={styles.dayDesc}>{isTh ? day.descTh : day.descEn}</p>
      <div className={styles.daySteps}>
        {day.steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            expanded={expandedSteps.has(step.id)}
            onToggle={() => onToggleStep(step.id)}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

function DuaCard({ dua, locale }: { dua: PilgrimageDua; locale: string }) {
  const isTh = locale === "th";

  return (
    <div className={styles.duaCard}>
      <div className={styles.duaCardHeader}>
        <div className={styles.duaCardTitles}>
          <span className={styles.duaCardName}>{isTh ? dua.nameTh : dua.nameEn}</span>
          <span className={styles.duaOccasionPill}>
            <BookOpen size={11} />
            <span>{isTh ? dua.occasionTh : dua.occasionEn}</span>
          </span>
        </div>
      </div>
      <p className={styles.duaArabic} lang="ar" dir="rtl">
        {dua.arabic}
      </p>
      <p className={styles.duaTranslit}>{dua.transliteration}</p>
      <p className={styles.duaTrans}>{isTh ? dua.translationTh : dua.translationEn}</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function HajjUmrahPage() {
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState<ActiveTab>("umrah");
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    () => new Set([UMRAH_STEPS[0]?.id ?? ""]),
  );

  function toggleStep(id: string) {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const isTh = locale === "th";

  return (
    <div className={styles.page}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.heroIcon}>🕋</div>
        <h1 className={styles.heroTitle}>{isTh ? "ฮัจญ์และอุมเราะห์" : "Hajj & Umrah"}</h1>
        <p className={styles.heroSubtitle}>
          {isTh ? "คู่มือครบถ้วนพร้อมดุอาอ์สำคัญ" : "Complete Guide with Essential Du'as"}
        </p>
      </header>

      {/* Tab Navigation */}
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "umrah"}
          className={`${styles.tab} ${activeTab === "umrah" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("umrah")}
        >
          {isTh ? "อุมเราะห์" : "Umrah"}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "hajj"}
          className={`${styles.tab} ${activeTab === "hajj" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("hajj")}
        >
          {isTh ? "ฮัจญ์" : "Hajj"}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "dua"}
          className={`${styles.tab} ${activeTab === "dua" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("dua")}
        >
          {isTh ? "ดุอาอ์" : "Du'as"}
        </button>
      </div>

      {/* Umrah Tab */}
      {activeTab === "umrah" && (
        <div className={styles.content}>
          <div className={styles.introCard}>
            <h2 className={styles.introTitle}>
              {isTh ? "อุมเราะห์ — การเยี่ยมเยียนอันศักดิ์สิทธิ์" : "Umrah — The Sacred Visit"}
            </h2>
            <p className={styles.introDesc}>
              {isTh
                ? "อุมเราะห์คือการแสวงบุญเล็กน้อยที่สามารถทำได้ตลอดทั้งปี ประกอบด้วย 4 ขั้นตอนหลัก: อิห์รอม เฏาวาฟ สะอฺยี และตัดหรือโกนผม"
                : "Umrah is the minor pilgrimage that can be performed at any time of year. It consists of 4 main steps: Ihram, Tawaf, Sa'i, and Taqsir/Halq."}
            </p>
          </div>
          {UMRAH_STEPS.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              expanded={expandedSteps.has(step.id)}
              onToggle={() => toggleStep(step.id)}
              locale={locale}
            />
          ))}
        </div>
      )}

      {/* Hajj Tab */}
      {activeTab === "hajj" && (
        <div className={styles.content}>
          <div className={styles.introCard}>
            <h2 className={styles.introTitle}>{isTh ? "ฮัจญ์ตะมัตตุอ์" : "Hajj Tamattu'"}</h2>
            <p className={styles.introDesc}>
              {isTh
                ? "ฮัจญ์ตะมัตตุอ์ คือการทำอุมเราะห์ก่อนในเดือนฮัจญ์ แล้วออกจากอิห์รอม จากนั้นเข้าอิห์รอมใหม่สำหรับฮัจญ์ในวันที่ 8 ซุลฮิจญะห์ นิยมใช้มากที่สุดในหมู่ผู้แสวงบุญจากเอเชียตะวันออกเฉียงใต้"
                : "Hajj Tamattu' means performing Umrah first during the Hajj months, then exiting Ihram, and re-entering Ihram for Hajj on the 8th of Dhul Hijjah. This is the most common form for Southeast Asian pilgrims."}
            </p>
          </div>
          {HAJJ_DAYS.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              expandedSteps={expandedSteps}
              onToggleStep={toggleStep}
              locale={locale}
            />
          ))}
        </div>
      )}

      {/* Dua Tab */}
      {activeTab === "dua" && (
        <div className={styles.content}>
          <div className={styles.introCard}>
            <h2 className={styles.introTitle}>
              {isTh ? "ดุอาอ์สำคัญในฮัจญ์และอุมเราะห์" : "Essential Du'as for Hajj & Umrah"}
            </h2>
            <p className={styles.introDesc}>
              {isTh
                ? "รวบรวมดุอาอ์สำคัญที่ควรกล่าวระหว่างการแสวงบุญ พร้อมคำอ่านและคำแปล"
                : "A collection of essential supplications to recite during pilgrimage, with transliteration and translation."}
            </p>
          </div>
          {IMPORTANT_DUAS.map((dua) => (
            <DuaCard key={dua.id} dua={dua} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
