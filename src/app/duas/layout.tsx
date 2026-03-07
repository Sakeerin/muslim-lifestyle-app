import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Duas",
  description: "Discover and read daily Islamic duas (supplications) for various occasions and needs.",
};

export default function DuasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
