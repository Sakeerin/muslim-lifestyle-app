import type { Metadata } from "next";

type Props = {
  params: Promise<{ surah: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surah } = await params;

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah}`);
    if (response.ok) {
      const payload = await response.json();
      const surahData = payload.data;

      return {
        title: `Surah ${surahData.englishName} (${surahData.name}) - Quran`,
        description: `Read and listen to Surah ${surahData.englishName} (${surahData.englishNameTranslation}) from the Holy Quran.`,
      };
    }
  } catch {
    // Ignore error and fall back to default metadata
  }

  return {
    title: `Surah ${surah} - Quran`,
    description: `Read and listen to Surah ${surah} from the Holy Quran.`,
  };
}

export default function SurahLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
