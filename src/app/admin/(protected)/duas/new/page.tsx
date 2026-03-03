import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "../../admin.module.css";

function toOptionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

async function createDua(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const arabic = String(formData.get("arabic") ?? "").trim();
  const translation = String(formData.get("translation") ?? "").trim();

  if (!title || !category || !arabic || !translation) {
    return;
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

export default function NewDuaPage() {
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
