import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { prisma } from "@/lib/prisma";
import { requireAdminAction, toOptionalString, slugify, getUniqueSlug } from "@/app/admin/_utils";
import styles from "../../../admin.module.css";

type EditLessonPageProps = {
  params: Promise<{ id: string }>;
};

async function updateLesson(formData: FormData) {
  "use server";
  await requireAdminAction();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!id || !title || !category || !content) {
    redirect(`/admin/lessons/${id}/edit?error=missing_fields`);
  }

  const slug = await getUniqueSlug(slugify(rawSlug || title), id);


  await prisma.lesson.update({
    where: { id },
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
  revalidatePath(`/lessons/${slug}`);
  redirect("/admin/lessons");
}

export default async function EditLessonPage({
  params,
  searchParams,
}: EditLessonPageProps & { searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const lesson = await prisma.lesson.findUnique({ where: { id } });

  if (!lesson) {
    notFound();
  }

  return (
    <div>
      {error === "missing_fields" && (
        <p className={styles.errorBanner}>Title, Category, and Content are required.</p>
      )}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit Lesson</h1>
          <p className={styles.subtitle}>Update text, media links, and publication status.</p>
        </div>
        <Link href="/admin/lessons" className={styles.linkButton}>
          Back to lessons
        </Link>
      </header>

      <form action={updateLesson} className={styles.form}>
        <input type="hidden" name="id" value={lesson.id} />

        <div className={styles.formGrid}>
          <label className={styles.field}>
            Title
            <input name="title" required defaultValue={lesson.title} />
          </label>

          <label className={styles.field}>
            Slug
            <input name="slug" defaultValue={lesson.slug} />
          </label>

          <label className={styles.field}>
            Category
            <input name="category" required defaultValue={lesson.category} />
          </label>

          <label className={styles.field}>
            Cover image URL
            <input name="coverImage" type="url" defaultValue={lesson.coverImage ?? ""} />
          </label>

          <label className={styles.field}>
            Video URL
            <input name="videoUrl" type="url" defaultValue={lesson.videoUrl ?? ""} />
          </label>
        </div>

        <div className={styles.field}>
          <span>Content</span>
          <RichTextEditor name="content" defaultValue={lesson.content} />
        </div>

        <label className={styles.checkboxRow}>
          <input name="isPublished" type="checkbox" defaultChecked={lesson.isPublished} />
          Published
        </label>

        <div className={styles.actions}>
          <button className={styles.linkButton} type="submit">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
