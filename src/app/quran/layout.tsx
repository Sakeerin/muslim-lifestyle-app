import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holy Quran",
  description: "Read the Holy Quran with translations in English and Thai. Browse all 114 Surahs and search for specific chapters.",
};

export default function QuranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
