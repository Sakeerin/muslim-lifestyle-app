"use client";

import { useEffect, useState } from "react";

export type HourlyPoint = {
  time: string; // "HH:MM"
  temp: number;
  code: number;
  rain: number;
};

export type DailyPoint = {
  date: string; // "YYYY-MM-DD"
  max: number;
  min: number;
  code: number;
  rain: number;
};

export type WeatherDetailState = {
  feelsLike: number | null;
  todayMax: number | null;
  todayMin: number | null;
  sunrise: string | null; // "HH:MM"
  sunset: string | null; // "HH:MM"
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  loading: boolean;
};

type RawResponse = {
  current: { apparent_temperature: number };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: (number | null)[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
  };
};

export function useWeatherDetail(lat: number, lng: number, enabled: boolean) {
  const [state, setState] = useState<WeatherDetailState>({
    feelsLike: null,
    todayMax: null,
    todayMin: null,
    sunrise: null,
    sunset: null,
    hourly: [],
    daily: [],
    loading: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    let mounted = true;
    setState((s) => ({ ...s, loading: true }));

    async function load() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lng}` +
          `&current=apparent_temperature` +
          `&hourly=temperature_2m,weather_code,precipitation_probability` +
          `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,sunrise,sunset` +
          `&timezone=auto&forecast_days=7`;

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as RawResponse;

        // Find current hour slot (local browser time)
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const localHourStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:00`;
        let startIdx = data.hourly.time.findIndex((t) => t >= localHourStr);
        if (startIdx < 0) startIdx = 0;

        const hourly: HourlyPoint[] = data.hourly.time
          .slice(startIdx, startIdx + 12)
          .map((t, i) => ({
            time: t.split("T")[1]?.slice(0, 5) ?? "--:--",
            temp: Math.round(data.hourly.temperature_2m[startIdx + i] ?? 0),
            code: data.hourly.weather_code[startIdx + i] ?? 0,
            rain: data.hourly.precipitation_probability[startIdx + i] ?? 0,
          }));

        const daily: DailyPoint[] = data.daily.time.map((d, i) => ({
          date: d,
          max: Math.round(data.daily.temperature_2m_max[i] ?? 0),
          min: Math.round(data.daily.temperature_2m_min[i] ?? 0),
          code: data.daily.weather_code[i] ?? 0,
          rain: data.daily.precipitation_probability_max[i] ?? 0,
        }));

        if (mounted) {
          setState({
            feelsLike: Math.round(data.current.apparent_temperature),
            todayMax: Math.round(data.daily.temperature_2m_max[0] ?? 0),
            todayMin: Math.round(data.daily.temperature_2m_min[0] ?? 0),
            sunrise: data.daily.sunrise[0]?.split("T")[1]?.slice(0, 5) ?? null,
            sunset: data.daily.sunset[0]?.split("T")[1]?.slice(0, 5) ?? null,
            hourly,
            daily,
            loading: false,
          });
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === "AbortError") {
          if (mounted) setState((s) => ({ ...s, loading: false }));
          return;
        }
        if (mounted) setState((s) => ({ ...s, loading: false }));
      }
    }

    void load();
    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [lat, lng, enabled]);

  return state;
}
