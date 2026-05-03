import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// ── Auth guard for server actions ──────────────────────────────────────────
export async function requireAdminAction() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }
}

// ── String helpers ──────────────────────────────────────────────────────────
export function toOptionalString(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug || `lesson-${Date.now()}`;
  let index = 1;

  while (true) {
    const exists = await prisma.lesson.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!exists || (excludeId && exists.id === excludeId)) {
      return candidate;
    }

    candidate = `${baseSlug}-${index}`;
    index += 1;
  }
}

// ── Validate that callbackUrl stays within /admin to prevent open redirect ─
export function safeCallbackUrl(raw: string | undefined): string {
  if (raw && raw.startsWith("/admin")) {
    return raw;
  }
  return "/admin";
}
