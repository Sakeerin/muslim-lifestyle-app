"use client";

import { useEffect, useMemo, useState } from "react";
import { Coins, RefreshCw } from "lucide-react";
import {
  calculateZakat,
  calculateNisab,
  formatCurrency,
  type Currency,
  type NisabStandard,
} from "@/lib/zakat-utils";
import { useMetalPrices } from "@/hooks/use-metal-prices";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

const CURRENCY_KEY = "zakat-currency";

function parseNum(s: string): number {
  const n = parseFloat(s);
  return isNaN(n) || n < 0 ? 0 : n;
}

export default function ZakatPage() {
  const { t } = useI18n();
  const { data: metalPrices, loading: pricesLoading, error: pricesError } = useMetalPrices();

  // Currency preference (default THB)
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(CURRENCY_KEY);
        if (stored === "THB" || stored === "USD") return stored as Currency;
      } catch {}
    }
    return "THB";
  });

  function setCurrency(next: Currency) {
    setCurrencyState(next);
    setManualPrice(null);
    try {
      localStorage.setItem(CURRENCY_KEY, next);
    } catch {}
  }

  // Nisab section
  const [nisabStandard, setNisabStandard] = useState<NisabStandard>("gold");
  const [manualPrice, setManualPrice] = useState<string | null>(null);

  const pricePerGram = useMemo(() => {
    if (manualPrice !== null) return manualPrice;
    if (!metalPrices) return "";

    const rawUsd = nisabStandard === "gold" ? metalPrices.goldPerGram : metalPrices.silverPerGram;
    const price =
      currency === "THB" && metalPrices.usdToThb ? rawUsd * metalPrices.usdToThb : rawUsd;
    const decimals = currency === "THB" ? 2 : 4;
    return price.toFixed(decimals);
  }, [metalPrices, nisabStandard, currency, manualPrice]);

  const isManualPrice = manualPrice !== null;

  // Assets
  const [cash, setCash] = useState("0");
  const [goldValue, setGoldValue] = useState("0");
  const [silverValue, setSilverValue] = useState("0");
  const [business, setBusiness] = useState("0");
  const [investments, setInvestments] = useState("0");
  const [receivables, setReceivables] = useState("0");

  // Liabilities
  const [debts, setDebts] = useState("0");

  // Real-time calculation
  const result = useMemo(
    () =>
      calculateZakat(
        {
          cash: parseNum(cash),
          goldValue: parseNum(goldValue),
          silverValue: parseNum(silverValue),
          business: parseNum(business),
          investments: parseNum(investments),
          receivables: parseNum(receivables),
        },
        { debts: parseNum(debts) },
        { standard: nisabStandard, pricePerGram: parseNum(pricePerGram) },
      ),
    [
      cash,
      goldValue,
      silverValue,
      business,
      investments,
      receivables,
      debts,
      nisabStandard,
      pricePerGram,
    ],
  );

  const nisabDisplay = useMemo(
    () => calculateNisab(nisabStandard, parseNum(pricePerGram)),
    [nisabStandard, pricePerGram],
  );

  function handlePriceChange(value: string) {
    setManualPrice(value);
  }

  function handleRestoreAutoPrice() {
    setManualPrice(null);
  }

  function handleReset() {
    setManualPrice(null);
    setCash("0");
    setGoldValue("0");
    setSilverValue("0");
    setBusiness("0");
    setInvestments("0");
    setReceivables("0");
    setDebts("0");
  }

  return (
    <div className={styles.page}>
      {/* ---- Header ---- */}
      <section className={styles.header}>
        <div className={styles.headerIcon}>
          <Coins size={26} />
        </div>
        <div>
          <h1>{t("zakat.title")}</h1>
          <p>{t("zakat.subtitle")}</p>
        </div>
      </section>

      {/* ---- Currency selector ---- */}
      <div className={styles.currencyBar}>
        <span className={styles.currencyLabel}>{t("zakat.currencySection")}</span>
        <div className={styles.currencyToggle}>
          <button
            type="button"
            className={`${styles.currencyBtn} ${currency === "THB" ? styles.currencyBtnActive : ""}`}
            onClick={() => setCurrency("THB")}
          >
            {t("zakat.currencyTHB")}
          </button>
          <button
            type="button"
            className={`${styles.currencyBtn} ${currency === "USD" ? styles.currencyBtnActive : ""}`}
            onClick={() => setCurrency("USD")}
          >
            {t("zakat.currencyUSD")}
          </button>
        </div>
        {currency === "THB" && metalPrices?.usdToThb && (
          <span className={styles.exchangeNote}>
            {t("zakat.exchangeRateNote", { rate: metalPrices.usdToThb.toFixed(2) })}
          </span>
        )}
      </div>

      {/* ---- Hawl reminder ---- */}
      <div className={styles.hawlBanner}>
        <span className={styles.hawlIcon}>☪</span>
        <p>{t("zakat.hawlReminder")}</p>
      </div>

      {/* ---- How to Use ---- */}
      <details className={styles.helpDetails}>
        <summary className={styles.helpSummary}>{t("zakat.howToUse")}</summary>
        <div className={styles.helpContent}>
          <ol className={styles.helpStepList}>
            <li className={styles.helpStep}>{t("zakat.helpStep1")}</li>
            <li className={styles.helpStep}>{t("zakat.helpStep2")}</li>
            <li className={styles.helpStep}>{t("zakat.helpStep3")}</li>
            <li className={styles.helpStep}>{t("zakat.helpStep4")}</li>
            <li className={styles.helpStep}>{t("zakat.helpStep5")}</li>
          </ol>
          <p className={styles.helpExampleNote}>{t("zakat.helpExample")}</p>
        </div>
      </details>

      {/* ---- Card 1: Nisab Standard ---- */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t("zakat.nisabSection")}</h2>
        <p className={styles.sectionDesc}>{t("zakat.nisabDesc")}</p>

        <div className={styles.standardToggle}>
          <button
            id="zakat-standard-gold"
            type="button"
            className={`${styles.standardBtn} ${nisabStandard === "gold" ? styles.standardBtnActive : ""}`}
            onClick={() => setNisabStandard("gold")}
          >
            {t("zakat.goldStandard")}
          </button>
          <button
            id="zakat-standard-silver"
            type="button"
            className={`${styles.standardBtn} ${nisabStandard === "silver" ? styles.standardBtnActive : ""}`}
            onClick={() => setNisabStandard("silver")}
          >
            {t("zakat.silverStandard")}
          </button>
        </div>

        <p className={styles.nisabWeight}>
          {nisabStandard === "gold" ? t("zakat.goldWeight") : t("zakat.silverWeight")}
        </p>

        <div className={styles.fieldRow}>
          <label htmlFor="zakat-price" className={styles.fieldLabel}>
            {nisabStandard === "gold" ? t("zakat.goldPriceLabel") : t("zakat.silverPriceLabel")}
            <span className={styles.fieldHint}>{t("zakat.priceHint")}</span>
          </label>

          <div className={styles.priceInputRow}>
            <input
              id="zakat-price"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={pricePerGram}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder={pricesLoading ? t("zakat.fetchingPrices") : "0"}
            />
            {isManualPrice && metalPrices && (
              <button
                type="button"
                className={styles.restoreBtn}
                onClick={handleRestoreAutoPrice}
                aria-label={t("zakat.useAutoPrice")}
                title={t("zakat.useAutoPrice")}
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>

          {pricesLoading && <span className={styles.priceBadge}>{t("zakat.fetchingPrices")}</span>}
          {pricesError && (
            <span className={`${styles.priceBadge} ${styles.priceBadgeError}`}>
              {t("zakat.priceError")}
            </span>
          )}
          {metalPrices && !isManualPrice && (
            <span className={`${styles.priceBadge} ${styles.priceBadgeAuto}`}>
              {t("zakat.autoPrice", { currency })} · {t("zakat.priceSource")}
            </span>
          )}
          {metalPrices && isManualPrice && (
            <button type="button" className={styles.restoreLink} onClick={handleRestoreAutoPrice}>
              {t("zakat.useAutoPrice")}
            </button>
          )}
        </div>

        {nisabDisplay > 0 && (
          <div className={styles.nisabResult}>
            <span className={styles.nisabResultLabel}>{t("zakat.nisabThreshold")}</span>
            <span className={styles.nisabResultValue}>
              {formatCurrency(nisabDisplay, currency)}
            </span>
          </div>
        )}
      </section>

      {/* ---- Card 2: Assets ---- */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t("zakat.assetsSection")}</h2>
        <p className={styles.sectionDesc}>{t("zakat.assetsDesc")}</p>

        <div className={styles.fieldList}>
          <div className={styles.fieldRow}>
            <label htmlFor="zakat-cash" className={styles.fieldLabel}>
              {t("zakat.cash")}
            </label>
            <input
              id="zakat-cash"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={cash}
              onChange={(e) => setCash(e.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor="zakat-gold" className={styles.fieldLabel}>
              {t("zakat.goldValue")}
              <span className={styles.fieldHint}>{t("zakat.goldValueHint")}</span>
            </label>
            <input
              id="zakat-gold"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={goldValue}
              onChange={(e) => setGoldValue(e.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor="zakat-silver" className={styles.fieldLabel}>
              {t("zakat.silverValue")}
              <span className={styles.fieldHint}>{t("zakat.silverValueHint")}</span>
            </label>
            <input
              id="zakat-silver"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={silverValue}
              onChange={(e) => setSilverValue(e.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor="zakat-business" className={styles.fieldLabel}>
              {t("zakat.business")}
            </label>
            <input
              id="zakat-business"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor="zakat-investments" className={styles.fieldLabel}>
              {t("zakat.investments")}
            </label>
            <input
              id="zakat-investments"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={investments}
              onChange={(e) => setInvestments(e.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <label htmlFor="zakat-receivables" className={styles.fieldLabel}>
              {t("zakat.receivables")}
            </label>
            <input
              id="zakat-receivables"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={receivables}
              onChange={(e) => setReceivables(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ---- Card 3: Liabilities ---- */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t("zakat.liabilitiesSection")}</h2>
        <p className={styles.sectionDesc}>{t("zakat.liabilitiesDesc")}</p>

        <div className={styles.fieldList}>
          <div className={styles.fieldRow}>
            <label htmlFor="zakat-debts" className={styles.fieldLabel}>
              {t("zakat.debts")}
              <span className={styles.fieldHint}>{t("zakat.debtsHint")}</span>
            </label>
            <input
              id="zakat-debts"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className={styles.fieldInput}
              value={debts}
              onChange={(e) => setDebts(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ---- Card 4: Results ---- */}
      <section className={`${styles.card} ${styles.resultsCard}`}>
        <h2 className={styles.sectionTitle}>{t("zakat.resultsSection")}</h2>

        <div className={styles.resultsList}>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>{t("zakat.totalAssets")}</span>
            <span className={styles.resultValue}>
              {formatCurrency(result.totalAssets, currency)}
            </span>
          </div>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>{t("zakat.totalDebts")}</span>
            <span className={`${styles.resultValue} ${styles.resultDebt}`}>
              − {formatCurrency(result.totalLiabilities, currency)}
            </span>
          </div>
          <div className={`${styles.resultRow} ${styles.resultRowNet}`}>
            <span className={styles.resultLabel}>{t("zakat.netWealth")}</span>
            <span className={styles.resultValue}>{formatCurrency(result.netWealth, currency)}</span>
          </div>
          {result.nisabThreshold > 0 && (
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>{t("zakat.nisabThreshold")}</span>
              <span className={styles.resultValue}>
                {formatCurrency(result.nisabThreshold, currency)}
              </span>
            </div>
          )}
        </div>

        <div
          className={`${styles.statusBadge} ${result.isEligible ? styles.statusEligible : styles.statusNotEligible}`}
        >
          {result.isEligible ? t("zakat.eligible") : t("zakat.notEligible")}
        </div>

        {result.isEligible && (
          <div className={styles.zakatDueBox}>
            <p className={styles.zakatDueLabel}>{t("zakat.zakatDue")}</p>
            <p className={styles.zakatDueAmount}>{formatCurrency(result.zakatDue, currency)}</p>
            <p className={styles.zakatRate}>{t("zakat.rateNote")}</p>
          </div>
        )}

        {result.nisabThreshold === 0 && (
          <p className={styles.nisabWarning}>{t("zakat.nisabNotSet")}</p>
        )}
      </section>

      {/* ---- Reset ---- */}
      <button type="button" className={styles.resetBtn} onClick={handleReset}>
        {t("zakat.reset")}
      </button>

      {/* ---- Disclaimer ---- */}
      <p className={styles.disclaimer}>{t("zakat.disclaimer")}</p>
    </div>
  );
}
