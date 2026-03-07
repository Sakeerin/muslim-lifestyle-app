"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { PlaceType } from "@prisma/client";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useI18n } from "@/i18n/i18n-context";
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
  const { t } = useI18n();

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

        setError(t("places.couldNotLoad"));
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
  }, [location.coordinates.latitude, location.coordinates.longitude, radius, type, t]);

  const mapCenter = useMemo<[number, number]>(
    () => [location.coordinates.latitude, location.coordinates.longitude],
    [location.coordinates.latitude, location.coordinates.longitude],
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>{t("places.title")}</h1>
        <p>{t("places.subtitle")}</p>
        <p>{location.error ?? t("places.usingLocation")}</p>

        <div className={styles.controls}>
          <label>
            {t("places.type")}
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "ALL" | PlaceType)}
            >
              <option value="ALL">{t("places.all")}</option>
              <option value="MOSQUE">{t("places.mosques")}</option>
              <option value="HALAL_FOOD">{t("places.halalFood")}</option>
            </select>
          </label>

          <label>
            {t("places.radius")}
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
        {loading ? (
          <p>{t("places.loadingMap")}</p>
        ) : (
          <PlacesMap center={mapCenter} places={items} />
        )}
      </section>

      <section className={styles.list}>
        {error ? <p>{error}</p> : null}
        {!loading && items.length === 0 ? <p>{t("places.noPlaces")}</p> : null}

        {items.map((place) => (
          <article key={place.id} className={styles.card}>
            <div className={styles.row}>
              <h2>{place.name}</h2>
              <span>{Math.round(place.distanceMeters)} m</span>
            </div>
            <p>{place.type === "MOSQUE" ? t("places.mosque") : t("places.halalFoodLabel")}</p>
            {place.address ? <p>{place.address}</p> : null}
            <div className={styles.footerRow}>
              <p>{place.source === "LOCAL" ? t("places.verified") : t("places.osm")}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                target="_blank"
                rel="noreferrer"
                className={styles.mapLink}
              >
                {t("places.goToMap") || "Go to Map"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
