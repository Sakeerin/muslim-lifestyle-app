import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halal Places",
  description: "Find halal restaurants, mosques, and Islamic centers near your location.",
};

export default function PlacesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
