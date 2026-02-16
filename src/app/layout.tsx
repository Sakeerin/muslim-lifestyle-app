import type { Metadata, Viewport } from "next";
import { EB_Garamond, Noto_Naskh_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { PwaRegister } from "@/components/features/pwa-register";
import "@/styles/globals.css";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
});

const naskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Muslim Lifestyle App",
  description: "Prayer times, Quran, Qibla, duas, and halal places.",
  manifest: "/manifest.webmanifest",
  applicationName: "MuslimPro",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f5e4d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${garamond.variable} ${naskhArabic.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
