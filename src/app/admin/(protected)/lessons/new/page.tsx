import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { prisma } from "@/lib/prisma";
import { requireAdminAction, toOptionalString, slugify, getUniqueSlug } from "@/app/admin/_utils";
import styles from "../../admin.module.css";

async function createLesson(formData: FormData) {
  "use server";
  await requireAdminAction();

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !category || !content) {
    redirect("/admin/lessons/new?error=missing_fields");
  }

  const baseSlug = slugify(rawSlug || title);
  const slug = await getUniqueSlug(baseSlug, undefined);

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

type NewLessonPageProps = { searchParams: Promise<{ error?: string }> };

export default async function NewLessonPage({ searchParams }: NewLessonPageProps) {
  const { error } = await searchParams;
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

      {error === "missing_fields" && (
        <p className={styles.errorBanner}>Title, Category, and Content are required.</p>
      )}

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
