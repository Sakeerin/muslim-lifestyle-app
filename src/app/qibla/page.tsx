"use client";

import { useEffect, useMemo, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getQiblaBearing } from "@/lib/qibla";
import styles from "./page.module.css";

type IOSOrientationPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export default function QiblaPage() {
  const location = useGeolocation();
  const [heading, setHeading] = useState(0);
  const [orientationReady, setOrientationReady] = useState(false);

  useEffect(() => {
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.alpha === "number") {
        setHeading(event.alpha);
        setOrientationReady(true);
      }
    };

    window.addEventListener("deviceorientation", onOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, []);

  const qiblaBearing = useMemo(() => {
    return getQiblaBearing(location.coordinates.latitude, location.coordinates.longitude);
  }, [location.coordinates.latitude, location.coordinates.longitude]);

  const rotation = ((qiblaBearing - heading + 360) % 360) * -1;

  const requestIOSPermission = async () => {
    const orientation = DeviceOrientationEvent as IOSOrientationPermission;
    if (!orientation.requestPermission) {
      return;
    }

    const result = await orientation.requestPermission();
    if (result === "granted") {
      setOrientationReady(true);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1>Qibla Compass</h1>
        <p>
          Hold your phone flat, then rotate slowly until the needle points up. Heading:{" "}
          {Math.round(heading)}deg
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.compass}>
          <div
            className={styles.needle}
            style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}
          />
          <div className={styles.center} />
        </div>
      </section>

      <section className={styles.card}>
        <p>Qibla bearing from your location: {Math.round(qiblaBearing)}deg</p>
        <p>{orientationReady ? "Compass is active." : "Orientation permission is required."}</p>
        <button type="button" onClick={() => void requestIOSPermission()}>
          Enable Orientation
        </button>
      </section>
    </div>
  );
}
