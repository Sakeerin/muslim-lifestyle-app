import type { Metadata, Viewport } from "next";
import { EB_Garamond, Noto_Naskh_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/i18n/i18n-context";
import { AppShell } from "@/components/layout/app-shell";
import { PwaRegister } from "@/components/features/pwa-register";
import "@/styles/globals.css";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

const naskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Muslim Lifestyle App",
    template: "%s | Muslim Lifestyle App",
  },
  description:
    "A comprehensive Muslim lifestyle app featuring accurate prayer times, the Holy Quran, Qibla compass, daily duas, and a halal places finder.",
  applicationName: "MuslimPro",
  authors: [{ name: "MuslimPro Team" }],
  keywords: ["Muslim", "Islam", "Prayer Times", "Quran", "Qibla", "Dua", "Halal"],
  creator: "MuslimPro Team",
  publisher: "MuslimPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  openGraph: {
    title: "Muslim Lifestyle App",
    description:
      "A comprehensive Muslim lifestyle app featuring accurate prayer times, the Holy Quran, Qibla compass, daily duas, and a halal places finder.",
    url: "/",
    siteName: "Muslim Lifestyle App",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muslim Lifestyle App",
    description:
      "A comprehensive Muslim lifestyle app featuring accurate prayer times, the Holy Quran, Qibla compass, daily duas, and a halal places finder.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MuslimPro",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f5e4d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
          <I18nProvider>
            <AppShell>{children}</AppShell>
            <PwaRegister />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
