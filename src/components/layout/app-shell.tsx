"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BookOpen,
  BookHeart,
  CalendarDays,
  Coins,
  Compass,
  Flame,
  Globe,
  Home,
  Moon,
  Settings,
  Star,
  Sunrise,
  Sun,
  TrendingUp,
  Wind,
} from "lucide-react";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./app-shell.module.css";

type NavItem = {
  href: string;
  labelKey: string;
  icon: typeof Home;
  mobileHide?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/prayer-times", labelKey: "nav.prayers", icon: Sunrise },
  { href: "/quran", labelKey: "nav.quran", icon: BookOpen },
  { href: "/qibla", labelKey: "nav.qibla", icon: Compass },
  { href: "/calendar", labelKey: "nav.calendar", icon: CalendarDays, mobileHide: true },
  { href: "/zakat", labelKey: "nav.zakat", icon: Coins, mobileHide: true },
  { href: "/names", labelKey: "nav.names", icon: Star, mobileHide: true },
  { href: "/tasbeeh", labelKey: "nav.tasbeeh", icon: Wind, mobileHide: true },
  { href: "/prayer-streak", labelKey: "nav.streak", icon: Flame, mobileHide: true },
  { href: "/azkar", labelKey: "nav.azkar", icon: Sun, mobileHide: true },
  { href: "/fasting", labelKey: "nav.fasting", icon: Moon, mobileHide: true },
  { href: "/duas/journal", labelKey: "nav.journal", icon: BookHeart, mobileHide: true },
  { href: "/ibadah", labelKey: "nav.ibadah", icon: Star, mobileHide: true },
  { href: "/stats", labelKey: "nav.stats", icon: TrendingUp, mobileHide: true },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>M</span>
            <span>{t("nav.brand")}</span>
          </div>
          <nav className={styles.desktopNav}>
            {navItems.map(({ href, labelKey, icon: Icon }) => {
              const active = isActive(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.navLink} ${active ? styles.active : ""}`}
                >
                  <Icon size={18} />
                  <span>{t(labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <button
            type="button"
            className={styles.langToggle}
            onClick={() => setLocale(locale === "en" ? "th" : "en")}
            aria-label="Toggle language"
          >
            <Globe size={16} />
            <span>{t("lang.toggle")}</span>
          </button>
          <ThemeToggle />
        </div>
      </aside>

      <main className={styles.main}>{children}</main>

      <nav className={styles.mobileNav}>
        {navItems
          .filter((item) => !item.mobileHide)
          .map(({ href, labelKey, icon: Icon }) => {
            const active = isActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                className={`${styles.mobileLink} ${active ? styles.mobileActive : ""}`}
              >
                <Icon />
                <span>{t(labelKey)}</span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
}
