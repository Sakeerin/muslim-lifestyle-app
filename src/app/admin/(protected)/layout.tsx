import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth, signOut } from "@/lib/auth";
import styles from "./admin.module.css";

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/lessons", label: "Lessons" },
  { href: "/admin/places", label: "Places" },
  { href: "/admin/duas", label: "Duas" },
];

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.eyebrow}>Admin CMS</p>
          <h2 className={styles.brand}>Muslim Lifestyle</h2>
          <p className={styles.adminEmail}>{session.user.email}</p>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button type="submit" className={styles.signOutButton}>
            Sign out
          </button>
        </form>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
