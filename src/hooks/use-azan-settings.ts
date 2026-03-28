"use client";

import { useLocalStorage } from "./use-local-storage";

export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];
export type PrayerToggles = Record<PrayerName, boolean>;

export type Reciter = {
  id: string;
  nameTh: string;
  nameEn: string;
  origin: string;
  audioUrl: string;
};

export const RECITERS: Reciter[] = [
  {
    id: "afasy",
    nameTh: "มิชอรี ราชิด อัล-อาฟาซี",
    nameEn: "Mishary Rashid Al-Afasy",
    origin: "คูเวต",
    audioUrl:
      "https://raw.githubusercontent.com/achaudhry/adhan/master/Adhan-Mishary-Rashid-Al-Afasy.mp3",
  },
  {
    id: "sudais",
    nameTh: "อับดุลเราะห์มาน อัส-สุดัยส์",
    nameEn: "Abdul Rahman As-Sudais",
    origin: "มัสยิดฮะรอม มักกะห์",
    audioUrl: "https://cdn.aladhan.com/audio/adhans/a4.mp3",
  },
  {
    id: "nabawi",
    nameTh: "มัสยิดนะบะวีย์",
    nameEn: "Masjid An-Nabawi",
    origin: "มะดีนะห์",
    audioUrl: "https://raw.githubusercontent.com/achaudhry/adhan/master/Adhan-Madinah.mp3",
  },
  {
    id: "haram",
    nameTh: "มัสยิดฮะรอม",
    nameEn: "Masjid Al-Haram",
    origin: "มักกะห์",
    audioUrl: "https://raw.githubusercontent.com/achaudhry/adhan/master/Adhan-Makkah.mp3",
  },
];

const DEFAULT_TOGGLES: PrayerToggles = {
  Fajr: false,
  Dhuhr: false,
  Asr: false,
  Maghrib: false,
  Isha: false,
};

export function useAzanSettings() {
  const [toggles, setToggles] = useLocalStorage<PrayerToggles>("azan-toggles", DEFAULT_TOGGLES);
  const [reciterId, setReciterId] = useLocalStorage<string>("azan-reciter", RECITERS[0]!.id);

  const togglePrayer = (prayer: PrayerName) => {
    setToggles({ ...toggles, [prayer]: !toggles[prayer] });
  };

  const activeReciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0]!;

  return { toggles, togglePrayer, reciterId, setReciterId, activeReciter };
}
