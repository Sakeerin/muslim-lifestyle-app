"use client";

import { useEffect, useState } from "react";
import type { MetalPricesResponse } from "@/app/api/metal-prices/route";

type MetalPricesState = {
  data: MetalPricesResponse | null;
  loading: boolean;
  error: boolean;
};

// Module-level cache: deduplicate concurrent requests and avoid re-fetching
// on every navigation. Resets on error so the next visit retries.
let _cachedPromise: Promise<MetalPricesResponse> | null = null;
let _cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useMetalPrices(): MetalPricesState {
  const [state, setState] = useState<MetalPricesState>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let mounted = true;

    const now = Date.now();
    if (!_cachedPromise || now - _cacheTimestamp > CACHE_TTL_MS) {
      _cacheTimestamp = now;
      _cachedPromise = fetch("/api/metal-prices")
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json() as Promise<MetalPricesResponse>;
        })
        .catch((err: unknown) => {
          _cachedPromise = null; // Reset so next visit retries
          throw err;
        });
    }

    _cachedPromise
      .then((data) => {
        if (mounted) setState({ data, loading: false, error: false });
      })
      .catch(() => {
        if (mounted) setState({ data: null, loading: false, error: true });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
