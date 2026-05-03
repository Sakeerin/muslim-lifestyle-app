import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/app/admin/_utils";
import styles from "../admin.module.css";

async function deleteLesson(formData: FormData) {
  "use server";
  await requireAdminAction();

  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (!id) return;

  await prisma.lesson.delete({ where: { id } });

  revalidatePath("/admin/lessons");
  revalidatePath("/lessons");
  if (slug) revalidatePath(`/lessons/${slug}`);
}

export default async function AdminLessonsPage() {
  // select excludes large content field — avoids loading MB of HTML per row
  const lessons = await prisma.lesson.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      isPublished: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Lessons Manager</h1>
          <p className={styles.subtitle}>Create, edit, publish, and remove lesson content.</p>
        </div>
        <Link href="/admin/lessons/new" className={styles.linkButton}>
          New lesson
        </Link>
      </header>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length === 0 ? (
              <tr>
                <td colSpan={5}>No lessons yet. Create your first lesson.</td>
              </tr>
            ) : null}

            {lessons.map((lesson) => (
              <tr key={lesson.id}>
                <td>
                  <strong>{lesson.title}</strong>
                  <p>{lesson.slug}</p>
                </td>
                <td>{lesson.category}</td>
                <td>
                  <span
                    className={`${styles.status} ${lesson.isPublished ? styles.statusPublished : styles.statusDraft}`}
                  >
                    {lesson.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td>{new Date(lesson.updatedAt).toLocaleString()}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/lessons/${lesson.id}/edit`} className={styles.linkButton}>
                      Edit
                    </Link>
                    <form action={deleteLesson} className={styles.inlineForm}>
                      <input type="hidden" name="id" value={lesson.id} />
                      <input type="hidden" name="slug" value={lesson.slug} />
                      <button className={styles.dangerButton} type="submit">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
