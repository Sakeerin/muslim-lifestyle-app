"use client";

import { useEffect, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Source = "gps" | "ip" | "default";

type GeolocationState = {
  coordinates: Coordinates;
  source: Source;
  isLoading: boolean;
  error: string | null;
};

const MAKKAH_COORDINATES: Coordinates = {
  latitude: 21.4225,
  longitude: 39.8262,
};

async function resolveIpLocation(): Promise<Coordinates | null> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      latitude?: number;
      longitude?: number;
    };

    if (typeof data.latitude === "number" && typeof data.longitude === "number") {
      return { latitude: data.latitude, longitude: data.longitude };
    }

    return null;
  } catch {
    return null;
  }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: MAKKAH_COORDINATES,
    source: "default",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const setFallback = async (message: string) => {
      const ipCoordinates = await resolveIpLocation();

      if (!mounted) {
        return;
      }

      if (ipCoordinates) {
        setState({
          coordinates: ipCoordinates,
          source: "ip",
          isLoading: false,
          error: message,
        });

        return;
      }

      setState({
        coordinates: MAKKAH_COORDINATES,
        source: "default",
        isLoading: false,
        error: message,
      });
    };

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      void setFallback("Geolocation unavailable on this device.");
      return () => {
        mounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted) {
          return;
        }

        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          source: "gps",
          isLoading: false,
          error: null,
        });
      },
      () => {
        void setFallback("Location permission denied, using fallback.");
      },
      { timeout: 9000, enableHighAccuracy: true },
    );

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
