import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "พระนามของอัลลอฮ์ | 99 Asmaa ul-Husna",
  description: "99 พระนามอันสวยงามของอัลลอฮ์ พร้อมความหมายภาษาอังกฤษและภาษาไทย",
};

export default function NamesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
