import type { ReactNode } from "react";
import styles from "./layout.module.css";

type AdminRootLayoutProps = {
  children: ReactNode;
};

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <div className={styles.root}>{children}</div>;
}
