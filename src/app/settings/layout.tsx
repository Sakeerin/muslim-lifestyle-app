import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your MuslimPro app preferences, including language, theme, and prayer time notifications.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
