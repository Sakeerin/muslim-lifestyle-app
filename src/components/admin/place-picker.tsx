"use client";

import { useMemo, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./place-picker.module.css";

type PlacePickerProps = {
  defaultLat?: number;
  defaultLng?: number;
};

type ClickCaptureProps = {
  onPick: (lat: number, lng: number) => void;
};

function ClickCapture({ onPick }: ClickCaptureProps) {
  useMapEvents({
    click: (event) => {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export function PlacePicker({ defaultLat = 21.4225, defaultLng = 39.8262 }: PlacePickerProps) {
  const [lat, setLat] = useState(defaultLat.toFixed(6));
  const [lng, setLng] = useState(defaultLng.toFixed(6));

  const numericLat = Number(lat);
  const numericLng = Number(lng);
  const center = useMemo<[number, number]>(() => {
    if (Number.isFinite(numericLat) && Number.isFinite(numericLng)) {
      return [numericLat, numericLng];
    }

    return [defaultLat, defaultLng];
  }, [defaultLat, defaultLng, numericLat, numericLng]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputs}>
        <label>
          Latitude
          <input
            name="lat"
            required
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            placeholder="21.422500"
          />
        </label>
        <label>
          Longitude
          <input
            name="lng"
            required
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            placeholder="39.826200"
          />
        </label>
      </div>

      <div className={styles.map}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture
            onPick={(pickedLat, pickedLng) => {
              setLat(pickedLat.toFixed(6));
              setLng(pickedLng.toFixed(6));
            }}
          />
          <CircleMarker
            center={center}
            radius={8}
            pathOptions={{ color: "#0f5e4d", fillOpacity: 0.78 }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
