"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VirtualizedAyahList, type AyahView } from "@/components/features/virtualized-ayah-list";
import styles from "./page.module.css";

type SurahAyah = {
  numberInSurah: number;
  text: string;
  audio?: string;
};

type SurahPayload = {
  data: {
    englishName: string;
    englishNameTranslation: string;
    name: string;
    ayahs: SurahAyah[];
  };
};

type SurahPageProps = {
  params: Promise<{ surah: string }>;
};

export default function SurahPage({ params }: SurahPageProps) {
  const [ayahs, setAyahs] = useState<AyahView[]>([]);
  const [audioAyahs, setAudioAyahs] = useState<SurahAyah[]>([]);
  const [surahInfo, setSurahInfo] = useState<{
    englishName: string;
    englishNameTranslation: string;
    name: string;
  } | null>(null);
  const [activeAyah, setActiveAyah] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [surahId, setSurahId] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function resolveParams() {
      const resolved = await params;
      if (mounted) {
        setSurahId(resolved.surah);
      }
    }

    void resolveParams();

    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!surahId) {
      return;
    }

    let mounted = true;

    async function loadSurahData() {
      try {
        const [arabicResponse, translationResponse, audioResponse] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}`, { cache: "no-store" }),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/en.asad`, { cache: "no-store" }),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.alafasy`, { cache: "no-store" }),
        ]);

        if (!arabicResponse.ok || !translationResponse.ok || !audioResponse.ok) {
          throw new Error("Unable to fetch surah");
        }

        const arabicPayload = (await arabicResponse.json()) as SurahPayload;
        const translationPayload = (await translationResponse.json()) as SurahPayload;
        const audioPayload = (await audioResponse.json()) as SurahPayload;

        if (!mounted) {
          return;
        }

        const combinedAyahs = arabicPayload.data.ayahs.map((ayah, index) => ({
          numberInSurah: ayah.numberInSurah,
          arabic: ayah.text,
          translation: translationPayload.data.ayahs[index]?.text ?? "",
        }));

        setSurahInfo({
          englishName: arabicPayload.data.englishName,
          englishNameTranslation: arabicPayload.data.englishNameTranslation,
          name: arabicPayload.data.name,
        });
        setAyahs(combinedAyahs);
        setAudioAyahs(audioPayload.data.ayahs);
      } catch {
        if (!mounted) {
          return;
        }

        setAyahs([]);
      }
    }

    void loadSurahData();

    return () => {
      mounted = false;
    };
  }, [surahId]);

  const currentAudio = useMemo(() => audioAyahs[activeAyah]?.audio ?? "", [activeAyah, audioAyahs]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    void audio.play();
    setIsPlaying(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>
          {surahInfo?.englishName ?? "Surah"} - {surahInfo?.name ?? ""}
        </h1>
        <p>{surahInfo?.englishNameTranslation}</p>
      </section>

      <section className={styles.card}>
        <h2>Audio controls</h2>
        <div className={styles.controls}>
          <button type="button" onClick={() => setActiveAyah((value) => Math.max(0, value - 1))}>
            Previous Ayah
          </button>
          <button type="button" onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => setActiveAyah((value) => Math.min(audioAyahs.length - 1, value + 1))}
          >
            Next Ayah
          </button>
        </div>
        <p>Playing ayah #{audioAyahs[activeAyah]?.numberInSurah ?? 1}</p>
        <audio
          key={currentAudio}
          ref={audioRef}
          src={currentAudio}
          onEnded={() => {
            setIsPlaying(false);
            setActiveAyah((value) => Math.min(audioAyahs.length - 1, value + 1));
          }}
        />
      </section>

      <VirtualizedAyahList ayahs={ayahs} />
    </div>
  );
}
