import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminAction, toOptionalString } from "@/app/admin/_utils";
import styles from "../../admin.module.css";

async function createDua(formData: FormData) {
  "use server";
  await requireAdminAction();

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const arabic = String(formData.get("arabic") ?? "").trim();
  const translation = String(formData.get("translation") ?? "").trim();

  if (!title || !category || !arabic || !translation) {
    redirect("/admin/duas/new?error=missing_fields");
  }

  await prisma.dua.create({
    data: {
      title,
      category,
      arabic,
      translation,
      transliteration: toOptionalString(formData.get("transliteration")),
      audioUrl: toOptionalString(formData.get("audioUrl")),
    },
  });

  revalidatePath("/admin/duas");
  revalidatePath("/duas");
  redirect("/admin/duas");
}

type NewDuaPageProps = { searchParams: Promise<{ error?: string }> };

export default async function NewDuaPage({ searchParams }: NewDuaPageProps) {
  const { error } = await searchParams;
  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Create Dua</h1>
          <p className={styles.subtitle}>Store Arabic text with transliteration and translation.</p>
        </div>
        <Link href="/admin/duas" className={styles.linkButton}>
          Back to duas
        </Link>
      </header>

      {error === "missing_fields" && (
        <p className={styles.errorBanner}>Title, Category, Arabic text, and Translation are required.</p>
      )}

      <form action={createDua} className={styles.form}>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            Title
            <input name="title" required />
          </label>

          <label className={styles.field}>
            Category
            <input name="category" required />
          </label>

          <label className={styles.field}>
            Transliteration
            <input name="transliteration" />
          </label>

          <label className={styles.field}>
            Audio URL
            <input name="audioUrl" type="url" placeholder="https://..." />
          </label>
        </div>

        <label className={styles.field}>
          Arabic text
          <textarea name="arabic" required />
        </label>

        <label className={styles.field}>
          Translation
          <textarea name="translation" required />
        </label>

        <div className={styles.actions}>
          <button className={styles.linkButton} type="submit">
            Save dua
          </button>
        </div>
      </form>
    </div>
  );
}
