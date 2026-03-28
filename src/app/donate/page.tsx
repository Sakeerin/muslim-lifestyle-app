"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Copy,
  Check,
  Linkedin,
  Mail,
  Clock,
  BookOpen,
  Compass,
  CalendarDays,
  Coins,
  MapPin,
  Scroll,
  ExternalLink,
} from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

const BANK_ACCOUNTS = [{ bank: "ธนาคารกรุงเทพ", bankEn: "Bangkok Bank", number: "902-0-245883" }];

const FEATURES = [
  { icon: Clock, key: "donate.featurePrayer" },
  { icon: Compass, key: "donate.featureQibla" },
  { icon: BookOpen, key: "donate.featureQuran" },
  { icon: CalendarDays, key: "donate.featureCalendar" },
  { icon: Coins, key: "donate.featureZakat" },
  { icon: Scroll, key: "donate.featureDua" },
  { icon: MapPin, key: "donate.featurePlaces" },
  { icon: Heart, key: "donate.featureMore" },
];

export default function DonatePage() {
  const { t } = useI18n();
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(number: string) {
    void navigator.clipboard.writeText(number).then(() => {
      setCopied(number);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOrb} />
        <span className={styles.heroIcon}>🤲</span>
        <h1 className={styles.heroTitle}>{t("donate.title")}</h1>
        <p className={styles.heroSub}>{t("donate.subtitle")}</p>
      </section>

      {/* Why section */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <Heart size={18} className={styles.cardHeaderIcon} />
          <h2>{t("donate.whyTitle")}</h2>
        </div>
        <p className={styles.bodyText}>{t("donate.whyBody")}</p>
        <ul className={styles.featureList}>
          {FEATURES.map(({ icon: Icon, key }) => (
            <li key={key} className={styles.featureItem}>
              <Icon size={15} className={styles.featureIcon} />
              <span>{t(key as Parameters<typeof t>[0])}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bank account */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.bankEmoji}>🏦</span>
          <h2>{t("donate.bankTitle")}</h2>
        </div>
        <p className={styles.bodyText}>{t("donate.bankBody")}</p>
        <div className={styles.bankCard}>
          <div className={styles.bankRow}>
            <span className={styles.bankLabel}>{t("donate.bankName")}</span>
            <span className={styles.bankValue}>นายสากีริน ขามิ๊</span>
          </div>
          <div className={styles.bankRow}>
            <span className={styles.bankLabel}>{t("donate.bankNameEn")}</span>
            <span className={styles.bankValue}>Mr. Sakeerin Khami</span>
          </div>
          {BANK_ACCOUNTS.map((acc) => (
            <div key={acc.number}>
              <div className={styles.bankDivider} />
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>{acc.bank}</span>
                <span className={styles.bankValue}>{acc.bankEn}</span>
              </div>
              <div className={styles.bankRow}>
                <span className={styles.bankLabel}>{t("donate.bankAccount")}</span>
                <div className={styles.accountRow}>
                  <span className={styles.accountNumber}>{acc.number}</span>
                  <button
                    className={copied === acc.number ? styles.copyBtnDone : styles.copyBtn}
                    onClick={() => handleCopy(acc.number)}
                    aria-label="Copy account number"
                  >
                    {copied === acc.number ? <Check size={14} /> : <Copy size={14} />}
                    {copied === acc.number ? t("donate.copied") : t("donate.copy")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.bankEmoji}>👨‍💻</span>
          <h2>{t("donate.devTitle")}</h2>
        </div>
        <div className={styles.devCard}>
          <div className={styles.devAvatar}>SK</div>
          <div className={styles.devInfo}>
            <p className={styles.devName}>Sakeerin Khami</p>
            <p className={styles.devRole}>{t("donate.devRole")}</p>
          </div>
        </div>
        <div className={styles.contactList}>
          <a
            href="https://www.linkedin.com/in/sakeerin-khami"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactItem}
          >
            <Linkedin size={16} className={styles.contactIcon} />
            <span>linkedin.com/in/sakeerin-khami</span>
            <ExternalLink size={12} className={styles.externalIcon} />
          </a>
          <a href="mailto:sakeerin.kh@gmail.com" className={styles.contactItem}>
            <Mail size={16} className={styles.contactIcon} />
            <span>sakeerin.kh@gmail.com</span>
          </a>
        </div>
      </section>

      {/* Thank you */}
      <section className={styles.thankYouCard}>
        <p className={styles.thankYouArabic}>جَزَاكَ اللّٰهُ خَيْرًا</p>
        <p className={styles.thankYouText}>{t("donate.thankYou")}</p>
        <Link href="/" className={styles.backBtn}>
          {t("donate.backHome")}
        </Link>
      </section>
    </div>
  );
}
