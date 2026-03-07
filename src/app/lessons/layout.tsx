import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islamic Lessons",
  description:
    "Learn about Islam through our curated lessons, covering basics, history, and daily practices.",
};

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
