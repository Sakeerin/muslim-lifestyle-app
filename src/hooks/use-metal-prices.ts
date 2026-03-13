"use client";

import { useEffect, useState } from "react";
import type { MetalPricesResponse } from "@/app/api/metal-prices/route";

type MetalPricesState = {
  data: MetalPricesResponse | null;
  loading: boolean;
  error: boolean;
};

export function useMetalPrices(): MetalPricesState {
  const [state, setState] = useState<MetalPricesState>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let mounted = true;

    fetch("/api/metal-prices")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<MetalPricesResponse>;
      })
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
