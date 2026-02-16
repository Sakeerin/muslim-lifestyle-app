import type { PrayerTimings } from "@/lib/api-clients/aladhan";

export const PRAYER_ORDER: Array<keyof PrayerTimings> = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function toDateFromTime(time: string) {
  const [hourPart, minutePart] = time.split(":");
  const now = new Date();
  const hours = Number(hourPart);
  const minutes = Number(minutePart);

  const date = new Date(now);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getNextPrayer(timings: PrayerTimings) {
  const now = new Date();

  for (const prayerName of PRAYER_ORDER) {
    const prayerTime = toDateFromTime(timings[prayerName]);

    if (prayerTime > now) {
      return { prayerName, prayerTime };
    }
  }

  const tomorrowFajr = toDateFromTime(timings.Fajr);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);

  return { prayerName: "Fajr" as const, prayerTime: tomorrowFajr };
}

export function formatCountdown(target: Date) {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return "Now";
  }

  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
