"use client";

import type { PlaceType } from "@prisma/client";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type PlacePoint = {
  id: string;
  name: string;
  type: PlaceType;
  lat: number;
  lng: number;
  address: string | null;
  source: "LOCAL" | "OSM";
  distanceMeters: number;
};

type PlacesMapProps = {
  center: [number, number];
  places: PlacePoint[];
};

export function PlacesMap({ center, places }: PlacesMapProps) {
  const bounds: [[number, number], [number, number]] = [
    [center[0] - 0.015, center[1] - 0.015],
    [center[0] + 0.015, center[1] + 0.015],
  ];

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place) => (
        <CircleMarker
          key={place.id}
          center={[place.lat, place.lng]}
          radius={7}
          pathOptions={{
            color: place.type === "MOSQUE" ? "#0f6f59" : "#916218",
            fillOpacity: 0.78,
          }}
        >
          <Popup>
            <strong>{place.name}</strong>
            <div>{place.type === "MOSQUE" ? "Mosque" : "Halal food"}</div>
            <div>{Math.round(place.distanceMeters)} m away</div>
            {place.address ? <div>{place.address}</div> : null}
            <div>{place.source === "LOCAL" ? "Verified local listing" : "OpenStreetMap"}</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
