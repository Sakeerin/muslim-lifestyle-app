"use client";

import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={styles.toggle}
        aria-label={t("theme.toggleLabel")}
      >
        <MoonStar size={16} />
        <span>{t("theme.dark")}</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("theme.toggleLabel")}
    >
      {isDark ? <Sun size={16} /> : <MoonStar size={16} />}
      <span>{isDark ? t("theme.light") : t("theme.dark")}</span>
    </button>
  );
}
