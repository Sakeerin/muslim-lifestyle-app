import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { prisma } from "@/lib/prisma";
import styles from "../../admin.module.css";

function toOptionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getUniqueSlug(baseSlug: string) {
  let candidate = baseSlug || `lesson-${Date.now()}`;
  let index = 1;

  while (true) {
    const exists = await prisma.lesson.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!exists) {
      return candidate;
    }

    candidate = `${baseSlug}-${index}`;
    index += 1;
  }
}

async function createLesson(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !category || !content) {
    return;
  }

  const baseSlug = slugify(rawSlug || title);
  const slug = await getUniqueSlug(baseSlug);

  await prisma.lesson.create({
    data: {
      title,
      slug,
      category,
      content,
      coverImage: toOptionalString(formData.get("coverImage")),
      videoUrl: toOptionalString(formData.get("videoUrl")),
      isPublished: formData.get("isPublished") === "on",
    },
  });

  revalidatePath("/admin/lessons");
  revalidatePath("/lessons");
  redirect("/admin/lessons");
}

export default function NewLessonPage() {
  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Create Lesson</h1>
          <p className={styles.subtitle}>Draft lesson content with markdown or HTML snippets.</p>
        </div>
        <Link href="/admin/lessons" className={styles.linkButton}>
          Back to lessons
        </Link>
      </header>

      <form action={createLesson} className={styles.form}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            Title
            <input name="title" required />
          </label>

          <label className={styles.field}>
            Slug (optional)
            <input name="slug" placeholder="auto-generated-from-title" />
          </label>

          <label className={styles.field}>
            Category
            <input name="category" required />
          </label>

          <label className={styles.field}>
            Cover image URL
            <input name="coverImage" type="url" placeholder="https://..." />
          </label>

          <label className={styles.field}>
            Video URL
            <input name="videoUrl" type="url" placeholder="https://..." />
          </label>
        </div>

        <div className={styles.field}>
          <span>Content</span>
          <RichTextEditor name="content" />
        </div>

        <label className={styles.checkboxRow}>
          <input name="isPublished" type="checkbox" />
          Publish immediately
        </label>

        <div className={styles.actions}>
          <button className={styles.linkButton} type="submit">
            Save lesson
          </button>
        </div>
      </form>
    </div>
  );
}
