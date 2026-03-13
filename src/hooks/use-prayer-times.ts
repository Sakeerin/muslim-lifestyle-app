"use client";

import { useEffect, useState } from "react";
import {
  fetchMonthlyPrayerCalendar,
  fetchTodayPrayerTimes,
  type MonthlyPrayerDay,
  type PrayerTimings,
} from "@/lib/api-clients/aladhan";
import { formatCountdown, getNextPrayer } from "@/lib/prayer-utils";
import { useGeolocation } from "@/hooks/use-geolocation";

type PrayerTimesState = {
  timings: PrayerTimings | null;
  date: string | null;
  monthly: MonthlyPrayerDay[];
  loading: boolean;
  error: string | null;
  countdown: string;
  nextPrayer: keyof PrayerTimings | null;
};

export function usePrayerTimes(method: number) {
  const location = useGeolocation();
  const [dayString, setDayString] = useState(() => 
    typeof window !== "undefined" ? new Date().toLocaleDateString() : ""
  );
  const [state, setState] = useState<PrayerTimesState>({
    timings: null,
    date: null,
    monthly: [],
    loading: true,
    error: null,
    countdown: "--:--:--",
    nextPrayer: null,
  });

  useEffect(() => {
    let mounted = true;

    async function loadPrayerData() {
      if (location.isLoading) {
        return;
      }

      try {
        setState((previous) => ({ ...previous, loading: true, error: null }));
        const [today, monthly] = await Promise.all([
          fetchTodayPrayerTimes({
            latitude: location.coordinates.latitude,
            longitude: location.coordinates.longitude,
            method,
          }),
          fetchMonthlyPrayerCalendar({
            latitude: location.coordinates.latitude,
            longitude: location.coordinates.longitude,
            method,
          }),
        ]);

        if (!mounted) {
          return;
        }

        const upcoming = getNextPrayer(today.timings);
        setState({
          timings: today.timings,
          date: today.date,
          monthly,
          loading: false,
          error: location.error,
          countdown: formatCountdown(upcoming.prayerTime),
          nextPrayer: upcoming.prayerName,
        });
      } catch {
        if (!mounted) {
          return;
        }

        setState((previous) => ({
          ...previous,
          loading: false,
          error: "Unable to fetch prayer schedule right now.",
        }));
      }
    }

    void loadPrayerData();

    return () => {
      mounted = false;
    };
  }, [
    location.coordinates.latitude,
    location.coordinates.longitude,
    location.error,
    location.isLoading,
    method,
    dayString,
  ]);

  useEffect(() => {
    if (!state.timings) {
      return;
    }

    const timer = window.setInterval(() => {
      const nowString = new Date().toLocaleDateString();
      if (dayString && nowString !== dayString) {
        setDayString(nowString);
        return;
      }

      const currentNext = getNextPrayer(state.timings!);
      
      setState((previous) => ({
        ...previous,
        countdown: formatCountdown(currentNext.prayerTime),
        nextPrayer: currentNext.prayerName,
      }));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [state.timings, dayString]);

  return {
    ...state,
    location,
  };
}
