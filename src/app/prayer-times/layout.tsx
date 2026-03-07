import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer Times",
  description: "Get accurate Islamic prayer times and countdown to the next prayer based on your location and preferred calculation method.",
};

export default function PrayerTimesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
