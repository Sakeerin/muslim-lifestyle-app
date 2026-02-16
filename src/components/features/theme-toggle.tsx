"use client";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
    >
      {isDark ? <Sun size={16} /> : <MoonStar size={16} />}
      <span>{isDark ? "Light" : "Dark"} Mode</span>
    </button>
  );
}
