"use client";

import { useEffect, useState } from "react";

type WeatherState = {
  temperature: number | null;
  weatherCode: number | null;
  humidity: number | null;
  loading: boolean;
};

type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    weather_code: number;
    relative_humidity_2m: number;
  };
};

export type WeatherInfo = {
  icon: string;
  labelEn: string;
  labelTh: string;
};

export function describeWeather(code: number): WeatherInfo {
  if (code === 0) return { icon: "☀️", labelEn: "Clear sky", labelTh: "ท้องฟ้าแจ่มใส" };
  if (code <= 2) return { icon: "⛅", labelEn: "Partly cloudy", labelTh: "มีเมฆบางส่วน" };
  if (code === 3) return { icon: "☁️", labelEn: "Overcast", labelTh: "ท้องฟ้าครึ้ม" };
  if (code <= 48) return { icon: "🌫️", labelEn: "Foggy", labelTh: "หมอกลง" };
  if (code <= 57) return { icon: "🌦️", labelEn: "Drizzle", labelTh: "ฝนปรอยๆ" };
  if (code <= 67) return { icon: "🌧️", labelEn: "Rain", labelTh: "ฝนตก" };
  if (code <= 77) return { icon: "❄️", labelEn: "Snow", labelTh: "หิมะตก" };
  if (code <= 82) return { icon: "🌦️", labelEn: "Rain showers", labelTh: "ฝนตกเป็นช่วงๆ" };
  if (code <= 86) return { icon: "❄️", labelEn: "Snow showers", labelTh: "หิมะโปรย" };
  return { icon: "⛈️", labelEn: "Thunderstorm", labelTh: "พายุฝนฟ้าคะนอง" };
}

export function useWeather(lat: number, lng: number, ready: boolean) {
  const [state, setState] = useState<WeatherState>({
    temperature: null,
    weatherCode: null,
    humidity: null,
    loading: true,
  });

  useEffect(() => {
    if (!ready) return;

    const controller = new AbortController();
    let mounted = true;

    async function fetchWeather() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lng}` +
          `&current=temperature_2m,weather_code,relative_humidity_2m`;

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          if (mounted) setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const data = (await res.json()) as OpenMeteoResponse;

        if (mounted) {
          setState({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            humidity: Math.round(data.current.relative_humidity_2m),
            loading: false,
          });
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (mounted) setState((prev) => ({ ...prev, loading: false }));
      }
    }

    void fetchWeather();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [lat, lng, ready]);

  return state;
}
