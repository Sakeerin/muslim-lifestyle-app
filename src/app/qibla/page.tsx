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
  const [rotation, setRotation] = useState(0);
  const { t } = useI18n();

  useEffect(() => {
    // We need to keep track of the accumulated rotation to prevent the needle 
    // from wildly spinning 360 degrees when crossing the North boundary (0 -> 359).
    let currentRotation = 0;

    const handleHeading = (newHeading: number) => {
       setHeading(newHeading);
       setOrientationReady(true);

       // Compute the target rotation based on the bearing and current heading
       // Qibla bearing is an absolute degree from North.
       // Heading is the device's current clockwise degree from North.
       const bearing = getQiblaBearing(location.coordinates.latitude, location.coordinates.longitude);
       
       // Calculate the shortest path to the new target rotation
       const targetRotation = bearing - newHeading;
       
       // Normalize the rotation difference to be between -180 and 180 degrees
       let diff = targetRotation - (currentRotation % 360);
       if (diff > 180) diff -= 360;
       if (diff < -180) diff += 360;
       
       currentRotation += diff;
       setRotation(currentRotation);
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      // iOS specific property for absolute compass heading
      if ("webkitCompassHeading" in event && typeof event.webkitCompassHeading === "number") {
        handleHeading(event.webkitCompassHeading);
        return;
      }

      // Android/Chrome absolute orientation fallback
      if (typeof event.alpha === "number") {
        // According to the standard, alpha is counter-clockwise.
        // We convert it to a clockwise compass heading.
        const compassHeading = 360 - event.alpha;
        handleHeading(compassHeading);
      }
    };

    // Try listening to absolute orientation first (primarily for Android)
    window.addEventListener("deviceorientationabsolute", onOrientation as EventListener, true);
    
    // Fallback to standard deviceorientation (used by iOS and older Androids)
    window.addEventListener("deviceorientation", onOrientation, true);

    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrientation as EventListener, true);
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [location.coordinates.latitude, location.coordinates.longitude]);

  const qiblaBearing = useMemo(() => {
    return getQiblaBearing(location.coordinates.latitude, location.coordinates.longitude);
  }, [location.coordinates.latitude, location.coordinates.longitude]);

  const requestIOSPermission = async () => {
    if (typeof DeviceOrientationEvent === "undefined") {
      return;
    }

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
