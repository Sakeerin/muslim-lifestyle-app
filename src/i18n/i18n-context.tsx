"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "./en.json";
import th from "./th.json";

export type Locale = "en" | "th";

type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = { en, th };

type I18nContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "app-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === "th" || stored === "en") {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLocaleState(stored);
            }
        } catch { }
        setMounted(true);
    }, []);

    const setLocale = useCallback(
        (next: Locale) => {
            setLocaleState(next);
            try {
                window.localStorage.setItem(STORAGE_KEY, next);
            } catch { }
        },
        [],
    );

    const t = useCallback(
        (key: string, params?: Record<string, string | number>): string => {
            let value = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;

            if (params) {
                for (const [param, replacement] of Object.entries(params)) {
                    value = value.replace(`{${param}}`, String(replacement));
                }
            }

            return value;
        },
        [locale],
    );

    const contextValue = useMemo<I18nContextValue>(
        () => ({ locale, setLocale, t }),
        [locale, setLocale, t],
    );

    // Avoid hydration mismatch — render children after mount
    if (!mounted) {
        return (
            <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
        );
    }

    return (
        <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
    );
}

export function useI18n(): I18nContextValue {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }

    return context;
}
