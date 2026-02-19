import { NextRequest, NextResponse } from "next/server";
import { listProximities } from "@/lib/places-proximities";

function parseCoordinate(value: string | null, name: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a number`);
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseCoordinate(searchParams.get("lat"), "lat");
    const lng = parseCoordinate(searchParams.get("lng"), "lng");
    const radius = Number(searchParams.get("radius"));
    const type = searchParams.get("type");

    const result = await listProximities({
      lat,
      lng,
      radius: Number.isFinite(radius) ? radius : undefined,
      type,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";

    return NextResponse.json(
      {
        error: {
          code: "INVALID_QUERY",
          message,
        },
      },
      { status: 400 },
    );
  }
}
