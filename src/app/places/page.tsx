"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { PlaceType } from "@prisma/client";
import { useGeolocation } from "@/hooks/use-geolocation";
import styles from "./page.module.css";

type ProximityItem = {
  id: string;
  name: string;
  type: PlaceType;
  lat: number;
  lng: number;
  address: string | null;
  description: string | null;
  source: "LOCAL" | "OSM";
  distanceMeters: number;
};

type ProximityResponse = {
  data: ProximityItem[];
  meta: {
    radius: number;
    total: number;
  };
};

const PlacesMap = dynamic(
  () => import("@/components/features/places-map").then((mod) => mod.PlacesMap),
  {
    ssr: false,
  },
);

export default function PlacesPage() {
  const location = useGeolocation();
  const [radius, setRadius] = useState(5000);
  const [type, setType] = useState<"ALL" | PlaceType>("ALL");
  const [items, setItems] = useState<ProximityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPlaces() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        lat: String(location.coordinates.latitude),
        lng: String(location.coordinates.longitude),
        radius: String(radius),
      });

      if (type !== "ALL") {
        params.set("type", type);
      }

      try {
        const response = await fetch(`/api/proximities?${params.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Unable to fetch places");
        }

        const payload = (await response.json()) as ProximityResponse;

        if (!mounted) {
          return;
        }

        setItems(payload.data);
      } catch {
        if (!mounted) {
          return;
        }

        setError("Could not load nearby places.");
        setItems([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadPlaces();

    return () => {
      mounted = false;
    };
  }, [location.coordinates.latitude, location.coordinates.longitude, radius, type]);

  const mapCenter = useMemo<[number, number]>(
    () => [location.coordinates.latitude, location.coordinates.longitude],
    [location.coordinates.latitude, location.coordinates.longitude],
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>Halal Places Finder</h1>
        <p>
          Explore nearby mosques and halal food spots around your location. Verified places are
          merged with OpenStreetMap data.
        </p>
        <p>{location.error ?? "Using current location."}</p>

        <div className={styles.controls}>
          <label>
            Type
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "ALL" | PlaceType)}
            >
              <option value="ALL">All</option>
              <option value="MOSQUE">Mosques</option>
              <option value="HALAL_FOOD">Halal Food</option>
            </select>
          </label>

          <label>
            Radius
            <select value={radius} onChange={(event) => setRadius(Number(event.target.value))}>
              <option value={1000}>1 km</option>
              <option value={3000}>3 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
              <option value={15000}>15 km</option>
            </select>
          </label>
        </div>
      </section>

      <section className={styles.mapWrap}>
        {loading ? <p>Loading map...</p> : <PlacesMap center={mapCenter} places={items} />}
      </section>

      <section className={styles.list}>
        {error ? <p>{error}</p> : null}
        {!loading && items.length === 0 ? <p>No places found in this radius.</p> : null}

        {items.map((place) => (
          <article key={place.id} className={styles.card}>
            <div className={styles.row}>
              <h2>{place.name}</h2>
              <span>{Math.round(place.distanceMeters)} m</span>
            </div>
            <p>{place.type === "MOSQUE" ? "Mosque" : "Halal food"}</p>
            {place.address ? <p>{place.address}</p> : null}
            <p>{place.source === "LOCAL" ? "Verified local place" : "OpenStreetMap listing"}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
