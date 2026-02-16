"use client";

import { useEffect, useMemo, useState } from "react";
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
  ]);

  const nextPrayerInfo = useMemo(() => {
    if (!state.timings) {
      return null;
    }

    return getNextPrayer(state.timings);
  }, [state.timings]);

  useEffect(() => {
    if (!nextPrayerInfo) {
      return;
    }

    const timer = window.setInterval(() => {
      setState((previous) => ({
        ...previous,
        countdown: formatCountdown(nextPrayerInfo.prayerTime),
        nextPrayer: nextPrayerInfo.prayerName,
      }));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [nextPrayerInfo]);

  return {
    ...state,
    location,
  };
}
