import { PlaceType, type Dua, type Lesson, type Place } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LessonQuery = {
  page: number;
  limit: number;
  category?: string;
  q?: string;
};

type DuaQuery = {
  category?: string;
  q?: string;
};

type PlaceQuery = {
  lat: number;
  lng: number;
  radius: number;
  type?: PlaceType;
};

type LessonSummary = {
  id: string;
  slug: string;
  title: string;
  category: string;
  coverImage: string | null;
  createdAt: string;
  excerpt: string;
};

export type PlaceWithDistance = {
  id: string;
  name: string;
  type: PlaceType;
  lat: number;
  lng: number;
  address: string | null;
  description: string | null;
  isVerified: boolean;
  source: "LOCAL" | "OSM";
  distanceMeters: number;
};

const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "lesson-tazkiyah-heart",
    title: "Purifying the Heart in a Distracted Age",
    slug: "purifying-the-heart-in-a-distracted-age",
    content:
      "A believer protects the heart through dhikr, gratitude, and intentional silence. Start every day with one ayah, one dua, and one act of service.",
    category: "Tazkiyah",
    coverImage: null,
    videoUrl: null,
    isPublished: true,
    createdAt: new Date("2025-12-05T08:00:00.000Z"),
    updatedAt: new Date("2025-12-05T08:00:00.000Z"),
  },
  {
    id: "lesson-seerah-mercy",
    title: "Mercy as a Daily Sunnah",
    slug: "mercy-as-a-daily-sunnah",
    content:
      "The Prophet (peace be upon him) modeled mercy in speech, family life, and leadership. Choose one sunnah each week and make it visible in your habits.",
    category: "Seerah",
    coverImage: null,
    videoUrl: null,
    isPublished: true,
    createdAt: new Date("2025-12-11T12:30:00.000Z"),
    updatedAt: new Date("2025-12-11T12:30:00.000Z"),
  },
  {
    id: "lesson-quran-consistency",
    title: "Consistency With the Quran",
    slug: "consistency-with-the-quran",
    content:
      "Consistency beats intensity. Five verses with reflection every day can transform understanding and behavior over time.",
    category: "Quran",
    coverImage: null,
    videoUrl: null,
    isPublished: true,
    createdAt: new Date("2025-12-17T16:00:00.000Z"),
    updatedAt: new Date("2025-12-17T16:00:00.000Z"),
  },
];

const SAMPLE_DUAS: Dua[] = [
  {
    id: "dua-morning-protection",
    title: "Morning Protection",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    translation: "O Allah, by You we enter the morning and by You we enter the evening.",
    transliteration: "Allahumma bika asbahna wa bika amsayna",
    audioUrl: null,
    category: "Morning",
    createdAt: new Date("2025-12-01T06:00:00.000Z"),
    updatedAt: new Date("2025-12-01T06:00:00.000Z"),
  },
  {
    id: "dua-anxiety",
    title: "Relief from Anxiety",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    translation: "O Allah, I seek refuge in You from anxiety and sorrow.",
    transliteration: "Allahumma inni a'udhu bika min al-hammi wal-hazan",
    audioUrl: null,
    category: "Wellbeing",
    createdAt: new Date("2025-12-02T06:00:00.000Z"),
    updatedAt: new Date("2025-12-02T06:00:00.000Z"),
  },
  {
    id: "dua-knowledge",
    title: "Increase in Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
    transliteration: "Rabbi zidni ilma",
    audioUrl: null,
    category: "Learning",
    createdAt: new Date("2025-12-03T06:00:00.000Z"),
    updatedAt: new Date("2025-12-03T06:00:00.000Z"),
  },
];

const SAMPLE_PLACES: Place[] = [
  {
    id: "place-masjid-haram",
    name: "Masjid al-Haram",
    type: PlaceType.MOSQUE,
    lat: 21.4225,
    lng: 39.8262,
    address: "Makkah, Saudi Arabia",
    description: "Central mosque in Makkah.",
    isVerified: true,
    createdAt: new Date("2025-12-01T00:00:00.000Z"),
    updatedAt: new Date("2025-12-01T00:00:00.000Z"),
  },
  {
    id: "place-madinah-prophet-mosque",
    name: "Al-Masjid an-Nabawi",
    type: PlaceType.MOSQUE,
    lat: 24.4672,
    lng: 39.6111,
    address: "Madinah, Saudi Arabia",
    description: "The Prophet's Mosque in Madinah.",
    isVerified: true,
    createdAt: new Date("2025-12-01T00:00:00.000Z"),
    updatedAt: new Date("2025-12-01T00:00:00.000Z"),
  },
  {
    id: "place-halal-makkah",
    name: "Makkah Halal Kitchen",
    type: PlaceType.HALAL_FOOD,
    lat: 21.4283,
    lng: 39.8274,
    address: "Ajyad, Makkah",
    description: "Verified halal dining option.",
    isVerified: true,
    createdAt: new Date("2025-12-01T00:00:00.000Z"),
    updatedAt: new Date("2025-12-01T00:00:00.000Z"),
  },
];

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function stripMarkup(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content: string, maxLength = 140) {
  const clean = stripMarkup(content);

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength - 1).trim()}...`;
}

function haversineDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadius = 6371e3;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function toLessonSummary(lesson: Lesson): LessonSummary {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    category: lesson.category,
    coverImage: lesson.coverImage,
    createdAt: lesson.createdAt.toISOString(),
    excerpt: makeExcerpt(lesson.content),
  };
}

function filterSampleLessons(query: LessonQuery) {
  const normalizedCategory = normalize(query.category);
  const normalizedQuery = normalize(query.q);

  return SAMPLE_LESSONS.filter((lesson) => {
    if (!lesson.isPublished) {
      return false;
    }

    if (normalizedCategory && normalize(lesson.category) !== normalizedCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      normalize(lesson.title).includes(normalizedQuery) ||
      normalize(lesson.category).includes(normalizedQuery) ||
      normalize(stripMarkup(lesson.content)).includes(normalizedQuery)
    );
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function filterSampleDuas(query: DuaQuery) {
  const normalizedCategory = normalize(query.category);
  const normalizedQuery = normalize(query.q);

  return SAMPLE_DUAS.filter((dua) => {
    if (normalizedCategory && normalize(dua.category) !== normalizedCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      normalize(dua.title).includes(normalizedQuery) ||
      normalize(dua.translation).includes(normalizedQuery) ||
      normalize(dua.arabic).includes(normalizedQuery) ||
      normalize(dua.transliteration).includes(normalizedQuery)
    );
  }).sort((a, b) => a.title.localeCompare(b.title));
}

function toPlaceWithDistance(place: Place, lat: number, lng: number): PlaceWithDistance {
  return {
    id: place.id,
    name: place.name,
    type: place.type,
    lat: place.lat,
    lng: place.lng,
    address: place.address,
    description: place.description,
    isVerified: place.isVerified,
    source: "LOCAL",
    distanceMeters: haversineDistanceMeters(lat, lng, place.lat, place.lng),
  };
}

export async function listPublishedLessons(query: LessonQuery) {
  const where = {
    isPublished: true,
    ...(query.category
      ? {
          category: {
            equals: query.category.trim(),
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q.trim(), mode: "insensitive" as const } },
            { category: { contains: query.q.trim(), mode: "insensitive" as const } },
            { content: { contains: query.q.trim(), mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  try {
    const [rows, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.lesson.count({ where }),
    ]);

    return {
      items: rows.map(toLessonSummary),
      total,
    };
  } catch {
    const lessons = filterSampleLessons(query);
    const start = (query.page - 1) * query.limit;
    const paged = lessons.slice(start, start + query.limit);

    return {
      items: paged.map(toLessonSummary),
      total: lessons.length,
    };
  }
}

export async function getPublishedLessonBySlug(slug: string) {
  try {
    return await prisma.lesson.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });
  } catch {
    return SAMPLE_LESSONS.find((lesson) => lesson.slug === slug && lesson.isPublished) ?? null;
  }
}

export async function listDuas(query: DuaQuery) {
  const where = {
    ...(query.category
      ? {
          category: {
            equals: query.category.trim(),
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q.trim(), mode: "insensitive" as const } },
            { translation: { contains: query.q.trim(), mode: "insensitive" as const } },
            { arabic: { contains: query.q.trim(), mode: "insensitive" as const } },
            { transliteration: { contains: query.q.trim(), mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  try {
    const rows = await prisma.dua.findMany({
      where,
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });
    const categories = Array.from(new Set(rows.map((dua) => dua.category))).sort();

    return { items: rows, categories };
  } catch {
    const rows = filterSampleDuas(query);
    const categories = Array.from(new Set(rows.map((dua) => dua.category))).sort();

    return { items: rows, categories };
  }
}

export async function listNearbyLocalPlaces(query: PlaceQuery) {
  try {
    const places = await prisma.place.findMany({
      where: {
        isVerified: true,
        ...(query.type ? { type: query.type } : {}),
      },
    });

    return places
      .map((place) => toPlaceWithDistance(place, query.lat, query.lng))
      .filter((place) => place.distanceMeters <= query.radius)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  } catch {
    return SAMPLE_PLACES.filter((place) => {
      if (!place.isVerified) {
        return false;
      }

      if (query.type && place.type !== query.type) {
        return false;
      }

      return true;
    })
      .map((place) => toPlaceWithDistance(place, query.lat, query.lng))
      .filter((place) => place.distanceMeters <= query.radius)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }
}

export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  return haversineDistanceMeters(lat1, lng1, lat2, lng2);
}
