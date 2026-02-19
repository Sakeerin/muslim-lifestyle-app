import { NextResponse } from "next/server";
import { getPublishedLessonBySlug } from "@/lib/dynamic-content";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;
  const lesson = await getPublishedLessonBySlug(slug);

  if (!lesson) {
    return NextResponse.json(
      {
        error: {
          code: "LESSON_NOT_FOUND",
          message: "Lesson not found.",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: lesson });
}
