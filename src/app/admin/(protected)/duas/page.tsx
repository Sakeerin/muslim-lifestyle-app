import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";

async function deleteDua(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await prisma.dua.delete({ where: { id } });
  revalidatePath("/admin/duas");
  revalidatePath("/duas");
}

export default async function AdminDuasPage() {
  const duas = await prisma.dua.findMany({
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Duas Manager</h1>
          <p className={styles.subtitle}>Maintain daily duas and translations.</p>
        </div>
        <Link href="/admin/duas/new" className={styles.linkButton}>
          New dua
        </Link>
      </header>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Arabic</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {duas.length === 0 ? (
              <tr>
                <td colSpan={4}>No duas yet. Add a new record.</td>
              </tr>
            ) : null}

            {duas.map((dua) => (
              <tr key={dua.id}>
                <td>
                  <strong>{dua.title}</strong>
                  <p>{dua.translation}</p>
                </td>
                <td>{dua.category}</td>
                <td>
                  {dua.arabic.slice(0, 84)}
                  {dua.arabic.length > 84 ? "..." : ""}
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/duas/${dua.id}/edit`} className={styles.linkButton}>
                      Edit
                    </Link>
                    <form action={deleteDua} className={styles.inlineForm}>
                      <input type="hidden" name="id" value={dua.id} />
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
