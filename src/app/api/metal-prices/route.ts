import { NextResponse } from "next/server";

// 1 troy ounce = 31.1034768 grams (international standard)
const TROY_OZ_TO_GRAM = 31.1034768;

export type MetalPricesResponse = {
  goldPerGram: number;
  silverPerGram: number;
  currency: "USD";
  source: string;
  updatedAt: string;
};

/**
 * Fetch live gold & silver spot prices from metals.live (free, no API key).
 * Prices are converted from USD/troy-oz to USD/gram.
 * Cached by Next.js for 1 hour to avoid hammering the upstream API.
 */
export async function GET() {
  try {
    const res = await fetch("https://metals.live/api/spot", {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; MuslimCompanion/1.0)",
      },
    });

    if (!res.ok) {
      throw new Error(`Upstream HTTP ${res.status}`);
    }

    // metals.live returns: [{ gold: number, silver: number, ... }] (USD / troy oz)
    const data = (await res.json()) as Array<{ gold?: number; silver?: number }>;
    const spot = Array.isArray(data) ? data[0] : null;

    if (!spot || typeof spot.gold !== "number" || typeof spot.silver !== "number") {
      throw new Error("Unexpected response format");
    }

    const body: MetalPricesResponse = {
      goldPerGram: Number((spot.gold / TROY_OZ_TO_GRAM).toFixed(4)),
      silverPerGram: Number((spot.silver / TROY_OZ_TO_GRAM).toFixed(4)),
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
