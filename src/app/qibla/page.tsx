"use client";

import { useEffect, useMemo, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getQiblaBearing } from "@/lib/qibla";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./page.module.css";

type IOSOrientationPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export default function QiblaPage() {
  const location = useGeolocation();
  const [heading, setHeading] = useState(0);
  const [orientationReady, setOrientationReady] = useState(false);
  const { t } = useI18n();

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
        <h1>{t("qibla.title")}</h1>
        <p>{t("qibla.instruction", { heading: Math.round(heading) })}</p>
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
        <p>{t("qibla.bearing", { bearing: Math.round(qiblaBearing) })}</p>
        <p>{orientationReady ? t("qibla.compassActive") : t("qibla.permissionRequired")}</p>
        <button type="button" onClick={() => void requestIOSPermission()}>
          {t("qibla.enableOrientation")}
        </button>
      </section>
    </div>
  );
}
