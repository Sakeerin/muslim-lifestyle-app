import { NextRequest, NextResponse } from "next/server";
import { listDuas } from "@/lib/dynamic-content";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.trim() || undefined;
  const q = searchParams.get("q")?.trim() || undefined;

  const { items, categories } = await listDuas({ category, q });

  return NextResponse.json({
    data: items,
    meta: {
      total: items.length,
      categories,
    },
  });
}
