import { NextResponse } from "next/server";

// 1 troy ounce = 31.1034768 grams (international standard)
const TROY_OZ_TO_GRAM = 31.1034768;

export type MetalPricesResponse = {
  goldPerGram: number;
  silverPerGram: number;
  usdToThb: number;
  currency: "USD";
  source: string;
  updatedAt: string;
};

/**
 * Fetch live gold & silver spot prices from metals.live (free, no API key).
 * Also fetch USD → THB exchange rate from frankfurter.app (free, no API key).
 * Prices are converted from USD/troy-oz to USD/gram.
 * Cached by Next.js for 1 hour.
 */
export async function GET() {
  try {
    // Fetch metals and exchange rate in parallel
    const [metalsRes, fxRes] = await Promise.all([
      fetch("https://metals.live/api/spot", {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; MuslimCompanion/1.0)",
        },
      }),
      fetch("https://api.frankfurter.app/latest?from=USD&to=THB", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!metalsRes.ok) {
      throw new Error(`Upstream metals HTTP ${metalsRes.status}`);
    }

    // metals.live returns: [{ gold: number, silver: number, ... }] (USD / troy oz)
    const data = (await metalsRes.json()) as Array<{ gold?: number; silver?: number }>;
    const spot = Array.isArray(data) ? data[0] : null;

    if (!spot || typeof spot.gold !== "number" || typeof spot.silver !== "number") {
      throw new Error("Unexpected metals response format");
    }

    // frankfurter.app returns: { rates: { THB: number } }
    let usdToThb = 34.0; // fallback rate
    try {
      if (fxRes.ok) {
        const fxData = (await fxRes.json()) as { rates?: { THB?: number } };
        if (typeof fxData.rates?.THB === "number") {
          usdToThb = fxData.rates.THB;
        }
      }
    } catch {
      // use fallback
    }

    const body: MetalPricesResponse = {
      goldPerGram: Number((spot.gold / TROY_OZ_TO_GRAM).toFixed(4)),
      silverPerGram: Number((spot.silver / TROY_OZ_TO_GRAM).toFixed(4)),
      usdToThb: Number(usdToThb.toFixed(2)),
      currency: "USD",
      source: "metals.live",
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
