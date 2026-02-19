import { PlaceType } from "@prisma/client";
import {
  distanceMeters,
  listNearbyLocalPlaces,
  type PlaceWithDistance,
} from "@/lib/dynamic-content";

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
};

type OverpassPayload = {
  elements?: OverpassElement[];
};

function parseType(value?: string | null) {
  if (value === PlaceType.MOSQUE || value === PlaceType.HALAL_FOOD) {
    return value;
  }

  return undefined;
}

function typeFromTags(tags: Record<string, string>) {
  if (tags.amenity === "place_of_worship" && tags.religion === "muslim") {
    return PlaceType.MOSQUE;
  }

  return PlaceType.HALAL_FOOD;
}

function asPlace(element: OverpassElement, lat: number, lng: number): PlaceWithDistance | null {
  const tags = element.tags ?? {};
  const placeLat = element.lat ?? element.center?.lat;
  const placeLng = element.lon ?? element.center?.lon;

  if (typeof placeLat !== "number" || typeof placeLng !== "number") {
    return null;
  }

  const name = tags.name ?? tags["name:en"] ?? "Unnamed place";
  const addressParts = [
    tags["addr:street"],
    tags["addr:housenumber"],
    tags["addr:city"],
    tags["addr:postcode"],
  ].filter(Boolean);

  return {
    id: `osm-${element.id}`,
    name,
    type: typeFromTags(tags),
    lat: placeLat,
    lng: placeLng,
    address: addressParts.length > 0 ? addressParts.join(", ") : null,
    description: tags.cuisine ? `Cuisine: ${tags.cuisine}` : null,
    isVerified: false,
    source: "OSM",
    distanceMeters: distanceMeters(lat, lng, placeLat, placeLng),
  };
}

async function fetchOverpassPlaces(lat: number, lng: number, radius: number) {
  const query = `[out:json][timeout:15];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
  node["shop"="halal"](around:${radius},${lat},${lng});
  way["shop"="halal"](around:${radius},${lat},${lng});
  node["cuisine"~"halal",i](around:${radius},${lat},${lng});
  way["cuisine"~"halal",i](around:${radius},${lat},${lng});
);
out center 50;`;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: {
      "Content-Type": "text/plain",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as OverpassPayload;

  return (payload.elements ?? [])
    .map((element) => asPlace(element, lat, lng))
    .filter((place): place is PlaceWithDistance => place !== null);
}

function dedupeAndSortPlaces(places: PlaceWithDistance[], limit: number) {
  const byKey = new Map<string, PlaceWithDistance>();

  for (const place of places) {
    const name = place.name.toLowerCase();
    const roundedLat = place.lat.toFixed(5);
    const roundedLng = place.lng.toFixed(5);
    const key = `${name}-${roundedLat}-${roundedLng}-${place.type}`;
    const existing = byKey.get(key);

    if (!existing || existing.source === "OSM") {
      byKey.set(key, place);
    }
  }

  return Array.from(byKey.values())
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
}

export async function listProximities(params: {
  lat: number;
  lng: number;
  radius?: number;
  type?: string | null;
}) {
  const type = parseType(params.type);
  const radius = Math.min(20000, Math.max(500, Math.floor(params.radius ?? 5000)));
  const localPlaces = await listNearbyLocalPlaces({
    lat: params.lat,
    lng: params.lng,
    radius,
    type,
  });

  let osmPlaces: PlaceWithDistance[] = [];
  try {
    osmPlaces = await fetchOverpassPlaces(params.lat, params.lng, radius);
  } catch {
    osmPlaces = [];
  }

  const merged = [...localPlaces, ...osmPlaces]
    .filter((place) => (type ? place.type === type : true))
    .filter((place) => place.distanceMeters <= radius);

  const data = dedupeAndSortPlaces(merged, 80);

  return {
    data,
    meta: {
      lat: params.lat,
      lng: params.lng,
      radius,
      type: type ?? "ALL",
      total: data.length,
      sources: {
        local: data.filter((place) => place.source === "LOCAL").length,
        osm: data.filter((place) => place.source === "OSM").length,
      },
    },
  };
}
