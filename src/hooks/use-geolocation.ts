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
  cityName: string | null;
};

const MAKKAH_COORDINATES: Coordinates = {
  latitude: 21.4225,
  longitude: 39.8262,
};

type IpApiResponse = {
  latitude?: number;
  longitude?: number;
  city?: string;
  country_name?: string;
};

type NominatimResponse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

async function resolveIpLocation(signal?: AbortSignal): Promise<{
  coordinates: Coordinates;
  cityName: string | null;
} | null> {
  try {
    const response = await fetch("https://ipapi.co/json/", { signal });

    if (!response.ok) return null;

    const data = (await response.json()) as IpApiResponse;

    if (typeof data.latitude === "number" && typeof data.longitude === "number") {
      const cityName =
        data.city && data.country_name ? `${data.city}, ${data.country_name}` : (data.city ?? null);

      return {
        coordinates: { latitude: data.latitude, longitude: data.longitude },
        cityName,
      };
    }

    return null;
  } catch {
    return null;
  }
}

async function resolveGpsCityName(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`;
    const response = await fetch(url, {
      headers: { "Accept-Language": "en" },
      signal,
    });

    if (!response.ok) return null;

    const data = (await response.json()) as NominatimResponse;
    const place =
      data.address?.city ??
      data.address?.town ??
      data.address?.village ??
      data.address?.county ??
      data.address?.state;
    const country = data.address?.country;

    if (place && country) return `${place}, ${country}`;
    if (place) return place;
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
    cityName: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    let watchId: number | null = null;

    const setFallback = async (message: string) => {
      const result = await resolveIpLocation(controller.signal);

      if (!mounted) return;

      if (result) {
        setState({
          coordinates: result.coordinates,
          source: "ip",
          isLoading: false,
          error: message,
          cityName: result.cityName,
        });
        return;
      }

      setState({
        coordinates: MAKKAH_COORDINATES,
        source: "default",
        isLoading: false,
        error: message,
        cityName: "Makkah al-Mukarramah, Saudi Arabia",
      });
    };

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      void setFallback("Geolocation unavailable on this device.");
      return () => {
        mounted = false;
        controller.abort();
      };
    }

    // Use watchPosition so we can clearWatch (cancel) in cleanup
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        // Got first fix — stop watching immediately
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (!mounted) return;

        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setState({
          coordinates,
          source: "gps",
          isLoading: false,
          error: null,
          cityName: null,
        });

        void resolveGpsCityName(coordinates.latitude, coordinates.longitude, controller.signal)
          .then((cityName) => {
            if (mounted) setState((previous) => ({ ...previous, cityName }));
          })
          .catch(() => {
            // City name is cosmetic — silently ignore if reverse-geocoding fails
          });
      },
      () => {
        void setFallback("Location permission denied, using fallback.");
      },
      { timeout: 5000, enableHighAccuracy: false, maximumAge: 60_000 },
    );

    return () => {
      mounted = false;
      controller.abort();
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
