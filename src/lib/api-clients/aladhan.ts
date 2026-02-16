type TimingsResponse = {
  data: {
    timings: Record<string, string>;
    date: {
      readable: string;
    };
  };
};

type CalendarEntry = {
  timings: Record<string, string>;
  date: {
    gregorian: {
      day: string;
      weekday: {
        en: string;
      };
    };
    hijri: {
      day: string;
      month: {
        en: string;
      };
      year: string;
    };
  };
};

type CalendarResponse = {
  data: CalendarEntry[];
};

export type PrayerTimings = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

const BASE_URL = "https://api.aladhan.com/v1";

function cleanTime(value: string) {
  return value.split(" ")[0] ?? value;
}

function normalizeTimings(timings: Record<string, string>): PrayerTimings {
  return {
    Fajr: cleanTime(timings.Fajr),
    Dhuhr: cleanTime(timings.Dhuhr),
    Asr: cleanTime(timings.Asr),
    Maghrib: cleanTime(timings.Maghrib),
    Isha: cleanTime(timings.Isha),
  };
}

type PrayerQuery = {
  latitude: number;
  longitude: number;
  method: number;
};

export async function fetchTodayPrayerTimes(query: PrayerQuery) {
  const params = new URLSearchParams({
    latitude: query.latitude.toString(),
    longitude: query.longitude.toString(),
    method: query.method.toString(),
  });

  const response = await fetch(`${BASE_URL}/timings?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch prayer times");
  }

  const payload = (await response.json()) as TimingsResponse;

  return {
    date: payload.data.date.readable,
    timings: normalizeTimings(payload.data.timings),
  };
}

export type MonthlyPrayerDay = {
  day: string;
  weekday: string;
  hijri: string;
  timings: PrayerTimings;
};

export async function fetchMonthlyPrayerCalendar(query: PrayerQuery) {
  const now = new Date();
  const params = new URLSearchParams({
    latitude: query.latitude.toString(),
    longitude: query.longitude.toString(),
    method: query.method.toString(),
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  });

  const response = await fetch(`${BASE_URL}/calendar?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch monthly calendar");
  }

  const payload = (await response.json()) as CalendarResponse;

  return payload.data.map((entry) => ({
    day: entry.date.gregorian.day,
    weekday: entry.date.gregorian.weekday.en,
    hijri: `${entry.date.hijri.day} ${entry.date.hijri.month.en} ${entry.date.hijri.year}`,
    timings: normalizeTimings(entry.timings),
  }));
}
