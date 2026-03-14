// Pure Zakat calculation utilities. No external dependencies.

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

export type Currency = "THB" | "USD";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  THB: "฿",
  USD: "$",
};

function addThousandsSep(n: number): string {
  const [int, dec] = n.toFixed(2).split(".");
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + dec;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NisabStandard = "gold" | "silver";

export interface ZakatAssets {
  cash: number; // Cash, bank balances
  goldValue: number; // Market value of gold owned
  silverValue: number; // Market value of silver owned
  business: number; // Business inventory / trade goods
  investments: number; // Stocks, funds, shares (market value)
  receivables: number; // Money owed to you (expected to be received)
}

export interface ZakatLiabilities {
  debts: number; // Immediate debts due within the lunar year
}

export interface NisabInput {
  standard: NisabStandard;
  pricePerGram: number; // Current gold or silver price in user's currency
}

export interface ZakatResult {
  totalAssets: number;
  totalLiabilities: number;
  netWealth: number;
  nisabThreshold: number;
  isEligible: boolean; // netWealth >= nisabThreshold (and nisabThreshold > 0)
  zakatDue: number; // 0 if not eligible, else netWealth * ZAKAT_RATE
}

// ---------------------------------------------------------------------------
// Constants — classical scholarly consensus values
// ---------------------------------------------------------------------------

/** Nisab weight: gold standard (grams) */
export const NISAB_GOLD_GRAMS = 87.48;

/** Nisab weight: silver standard (grams) */
export const NISAB_SILVER_GRAMS = 612.36;

/** Zakat rate: 2.5% (1/40th) of net zakatable wealth */
export const ZAKAT_RATE = 0.025;

// ---------------------------------------------------------------------------
// Pure functions
// ---------------------------------------------------------------------------

/**
 * Calculate the Nisab threshold in currency units.
 * @param standard - "gold" uses 87.48g; "silver" uses 612.36g
 * @param pricePerGram - Current spot price of the chosen metal in local currency
 */
export function calculateNisab(standard: NisabStandard, pricePerGram: number): number {
  const grams = standard === "gold" ? NISAB_GOLD_GRAMS : NISAB_SILVER_GRAMS;
  return grams * pricePerGram;
}

/**
 * Calculate Zakat due given assets, liabilities, and Nisab inputs.
 *
 * Formula:
 *   totalAssets  = sum of all zakatable asset values
 *   netWealth    = totalAssets − debts  (floored at 0)
 *   nisab        = pricePerGram × metal_grams
 *   isEligible   = nisab > 0 AND netWealth >= nisab
 *   zakatDue     = isEligible ? netWealth × 0.025 : 0
 */
export function calculateZakat(
  assets: ZakatAssets,
  liabilities: ZakatLiabilities,
  nisabInput: NisabInput,
): ZakatResult {
  const totalAssets =
    assets.cash +
    assets.goldValue +
    assets.silverValue +
    assets.business +
    assets.investments +
    assets.receivables;

  const totalLiabilities = liabilities.debts;
  const netWealth = Math.max(0, totalAssets - totalLiabilities);
  const nisabThreshold = calculateNisab(nisabInput.standard, nisabInput.pricePerGram);
  const isEligible = nisabThreshold > 0 && netWealth >= nisabThreshold;
  const zakatDue = isEligible ? netWealth * ZAKAT_RATE : 0;

  return {
    totalAssets,
    totalLiabilities,
    netWealth,
    nisabThreshold,
    isEligible,
    zakatDue,
  };
}

/**
 * Format a monetary value with currency symbol and thousands separators.
 * Uses regex (not toLocaleString) to avoid locale-dependent output and hydration mismatches.
 */
export function formatCurrency(value: number, currency: Currency = "USD"): string {
  return CURRENCY_SYMBOLS[currency] + addThousandsSep(value);
}
