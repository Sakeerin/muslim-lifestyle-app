"use client";

import { useLocalStorage } from "./use-local-storage";

export type QuranReciter = {
  id: string;
  apiEdition: string;
  nameTh: string;
  nameEn: string;
  origin: string;
  styleTh: string;
  styleEn: string;
  previewUrl: string;
};

export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: "alafasy",
    apiEdition: "ar.alafasy",
    nameTh: "มิชอรี ราชิด อัล-อาฟาซี",
    nameEn: "Mishary Rashid Al-Afasy",
    origin: "คูเวต",
    styleTh: "มุรัตตัล · เสียงนุ่ม ไพเราะ",
    styleEn: "Murattal · Melodious",
    previewUrl: "https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/2",
  },
  {
    id: "sudais",
    apiEdition: "ar.abdurrahmaansudais",
    nameTh: "อับดุลเราะห์มาน อัส-สุดัยส์",
    nameEn: "Abdul Rahman As-Sudais",
    origin: "มัสยิดฮะรอม มักกะห์",
    styleTh: "มุรัตตัล · อิหม่ามมัสยิดฮะรอม",
    styleEn: "Murattal · Imam of Grand Mosque",
    previewUrl: "https://cdn.alquran.cloud/media/audio/ayah/ar.abdurrahmaansudais/2",
  },
  {
    id: "muaiqly",
    apiEdition: "ar.mahermuaiqly",
    nameTh: "มาเฮร์ อัล-มุอัยกอลี",
    nameEn: "Maher Al-Muaiqly",
    origin: "มัสยิดฮะรอม มักกะห์",
    styleTh: "มุรัตตัล · เสียงใส ชัดเจน",
    styleEn: "Murattal · Clear & Crisp",
    previewUrl: "https://cdn.alquran.cloud/media/audio/ayah/ar.mahermuaiqly/2",
  },
  {
    id: "shuraym",
    apiEdition: "ar.saoodshuraym",
    nameTh: "ซาอุด อัช-ชุรัยม์",
    nameEn: "Saud Al-Shuraym",
    origin: "มัสยิดฮะรอม มักกะห์",
    styleTh: "มุรัตตัล · สงบ เปี่ยมอิมาน",
    styleEn: "Murattal · Calm & Spiritual",
    previewUrl: "https://cdn.alquran.cloud/media/audio/ayah/ar.saoodshuraym/2",
  },
  {
    id: "husary",
    apiEdition: "ar.husary",
    nameTh: "มะห์มูด คอลิล อัล-ฮุซอรี",
    nameEn: "Mahmoud Khalil Al-Husary",
    origin: "อียิปต์",
    styleTh: "มุรัตตัล · ตัจวีดชัดเจน เหมาะสำหรับการเรียน",
    styleEn: "Murattal · Clear Tajweed · Educational",
    previewUrl: "https://cdn.alquran.cloud/media/audio/ayah/ar.husary/2",
  },
  {
    id: "minshawi",
    apiEdition: "ar.minshawi",
    nameTh: "มุฮัมมัด ศิดดีก อัล-มินชาวี",
    nameEn: "Muhammad Siddiq Al-Minshawi",
    origin: "อียิปต์",
    styleTh: "มุรัตตัล · สำนักอียิปต์คลาสสิก",
    styleEn: "Murattal · Classic Egyptian Style",
    previewUrl: "https://cdn.alquran.cloud/media/audio/ayah/ar.minshawi/2",
  },
];

export function useQuranReciter() {
  const [reciterId, setReciterId] = useLocalStorage<string>("quran-reciter", QURAN_RECITERS[0]!.id);

  const activeReciter = QURAN_RECITERS.find((r) => r.id === reciterId) ?? QURAN_RECITERS[0]!;

  return { reciterId, setReciterId, activeReciter };
}
