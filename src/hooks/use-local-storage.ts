"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * SSR-safe localStorage hook.
 * Always initializes with defaultValue (avoids hydration mismatch),
 * then reads the stored value on the client after mount.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try {
          const parsed = JSON.parse(raw) as T;
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setValue((prev) => (prev !== parsed ? parsed : prev));
        } catch {
          // Legacy: stored as plain string (not JSON-encoded)
          const legacy = raw as unknown as T;
          setValue((prev) => (prev !== legacy ? legacy : prev));
        }
      }
    } catch {}
  }, [key]);

  const set = useCallback(
    (val: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof val === "function" ? (val as (prev: T) => T)(prev) : val;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key],
  );

  return [value, set];
}
