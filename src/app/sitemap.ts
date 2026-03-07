import type { MetadataRoute } from "next";

const routes = [
  "",
  "/prayer-times",
  "/quran",
  "/qibla",
  "/lessons",
  "/duas",
  "/places",
  "/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://muslim-lifestyle-app.vercel.app";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}
