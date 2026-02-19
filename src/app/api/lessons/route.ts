import { NextRequest, NextResponse } from "next/server";
import { listPublishedLessons } from "@/lib/dynamic-content";

function parseNumber(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(parsed)));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseNumber(searchParams.get("page"), 1, 1, 1000);
  const limit = parseNumber(searchParams.get("limit"), 10, 1, 50);
  const category = searchParams.get("category")?.trim() || undefined;
  const q = searchParams.get("q")?.trim() || undefined;

  const { items, total } = await listPublishedLessons({ page, limit, category, q });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return NextResponse.json({
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}
