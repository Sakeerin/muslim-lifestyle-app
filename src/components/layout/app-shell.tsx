"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BookOpen, Compass, Home, Settings, Sunrise } from "lucide-react";
import { ThemeToggle } from "@/components/features/theme-toggle";
import styles from "./app-shell.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/prayer-times", label: "Prayers", icon: Sunrise },
  { href: "/quran", label: "Quran", icon: BookOpen },
  { href: "/qibla", label: "Qibla", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
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

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>M</span>
            <span>Muslim Companion</span>
          </div>
          <nav className={styles.desktopNav}>
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.navLink} ${active ? styles.active : ""}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <ThemeToggle />
      </aside>

      <main className={styles.main}>{children}</main>

      <nav className={styles.mobileNav}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileLink} ${active ? styles.mobileActive : ""}`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
