import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "../../../admin.module.css";

type EditDuaPageProps = {
  params: Promise<{ id: string }>;
};

function toOptionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

async function updateDua(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const arabic = String(formData.get("arabic") ?? "").trim();
  const translation = String(formData.get("translation") ?? "").trim();

  if (!id || !title || !category || !arabic || !translation) {
    return;
  }

  await prisma.dua.update({
    where: { id },
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

export default async function EditDuaPage({ params }: EditDuaPageProps) {
  const { id } = await params;
  const dua = await prisma.dua.findUnique({ where: { id } });

  if (!dua) {
    notFound();
  }

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit Dua</h1>
          <p className={styles.subtitle}>Update wording, category, and optional audio.</p>
        </div>
        <Link href="/admin/duas" className={styles.linkButton}>
          Back to duas
        </Link>
      </header>

      <form action={updateDua} className={styles.form}>
        <input type="hidden" name="id" value={dua.id} />

        <div className={styles.formGrid}>
          <label className={styles.field}>
            Title
            <input name="title" required defaultValue={dua.title} />
          </label>

          <label className={styles.field}>
            Category
            <input name="category" required defaultValue={dua.category} />
          </label>

          <label className={styles.field}>
            Transliteration
            <input name="transliteration" defaultValue={dua.transliteration ?? ""} />
          </label>

          <label className={styles.field}>
            Audio URL
            <input name="audioUrl" type="url" defaultValue={dua.audioUrl ?? ""} />
          </label>
        </div>

        <label className={styles.field}>
          Arabic text
          <textarea name="arabic" required defaultValue={dua.arabic} />
        </label>

        <label className={styles.field}>
          Translation
          <textarea name="translation" required defaultValue={dua.translation} />
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
