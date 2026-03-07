import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qibla Compass",
  description: "Find the precise Qibla direction from your current location anywhere in the world.",
};

export default function QiblaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
