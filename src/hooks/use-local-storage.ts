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
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try {
          setValue(JSON.parse(raw) as T);
        } catch {
          // Legacy: stored as plain string (not JSON-encoded)
          setValue(raw as unknown as T);
        }
      }
    } catch {}
  }, [key]);

  const set = useCallback(
    (val: T) => {
      setValue(val);
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {}
    },
    [key],
  );

  return [value, set];
}
