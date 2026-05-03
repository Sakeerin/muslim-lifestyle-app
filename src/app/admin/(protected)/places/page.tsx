import Link from "next/link";
import { PlaceType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlacePicker } from "@/components/admin/place-picker";
import { requireAdminAction, toOptionalString } from "@/app/admin/_utils";
import styles from "../admin.module.css";

async function createPlace(formData: FormData) {
  "use server";
  await requireAdminAction();

  const name = String(formData.get("name") ?? "").trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));

  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    redirect("/admin/places?error=missing_fields");
  }

  const type = formData.get("type") === "HALAL_FOOD" ? PlaceType.HALAL_FOOD : PlaceType.MOSQUE;

  await prisma.place.create({
    data: {
      name,
      type,
      lat,
      lng,
      address: toOptionalString(formData.get("address")),
      description: toOptionalString(formData.get("description")),
      isVerified: formData.get("isVerified") === "on",
    },
  });

  revalidatePath("/admin/places");
  revalidatePath("/places");
  redirect("/admin/places?success=place_added");
}

async function deletePlace(formData: FormData) {
  "use server";
  await requireAdminAction();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.place.delete({ where: { id } });
  revalidatePath("/admin/places");
  revalidatePath("/places");
}

type PlacesPageProps = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function AdminPlacesPage({ searchParams }: PlacesPageProps) {
  const { error, success } = await searchParams;
  const places = await prisma.place.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  const verified = places.filter((p) => p.isVerified);
  const unverified = places.filter((p) => !p.isVerified);

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Places Manager</h1>
          <p className={styles.subtitle}>
            List places and add coordinates with the map picker.
          </p>
        </div>
        <Link href="/places" className={styles.linkButton}>
          Open public map
        </Link>
      </header>

      {error === "missing_fields" && (
        <p className={styles.errorBanner}>Name and valid coordinates are required.</p>
      )}
      {success === "place_added" && (
        <p className={styles.successBanner}>Place saved successfully.</p>
      )}

      <section>
        <h2 style={{ marginBottom: "0.65rem" }}>
          Verified Places ({verified.length})
        </h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Coordinates</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verified.length === 0 ? (
                <tr>
                  <td colSpan={5}>No verified places yet.</td>
                </tr>
              ) : null}

              {verified.map((place) => (
                <tr key={place.id}>
                  <td>
                    <strong>{place.name}</strong>
                  </td>
                  <td>{place.type === "MOSQUE" ? "Mosque" : "Halal Food"}</td>
                  <td>
                    {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
                  </td>
                  <td>{place.address ?? "-"}</td>
                  <td>
                    <form action={deletePlace} className={styles.inlineForm}>
                      <input type="hidden" name="id" value={place.id} />
                      <button className={styles.dangerButton} type="submit">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {unverified.length > 0 && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2 style={{ marginBottom: "0.65rem" }}>
            Pending Verification ({unverified.length})
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Coordinates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unverified.map((place) => (
                  <tr key={place.id}>
                    <td><strong>{place.name}</strong></td>
                    <td>{place.type === "MOSQUE" ? "Mosque" : "Halal Food"}</td>
                    <td>{place.lat.toFixed(5)}, {place.lng.toFixed(5)}</td>
                    <td>
                      <div className={styles.actions}>
                        <form action={deletePlace} className={styles.inlineForm}>
                          <input type="hidden" name="id" value={place.id} />
                          <button className={styles.dangerButton} type="submit">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}


      <section style={{ marginTop: "1.2rem" }}>
        <h2 style={{ marginBottom: "0.65rem" }}>Add New Place</h2>
        <form action={createPlace} className={styles.form}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              Name
              <input name="name" required />
            </label>

            <label className={styles.field}>
              Type
              <select name="type" defaultValue="MOSQUE">
                <option value="MOSQUE">Mosque</option>
                <option value="HALAL_FOOD">Halal Food</option>
              </select>
            </label>

            <label className={styles.field}>
              Address
              <input name="address" />
            </label>
          </div>

          <label className={styles.field}>
            Description
            <textarea name="description" />
          </label>

          <div className={styles.mapBox}>
            <PlacePicker />
          </div>

          <label className={styles.checkboxRow}>
            <input name="isVerified" type="checkbox" defaultChecked />
            Mark as verified
          </label>

          <div className={styles.actions}>
            <button className={styles.linkButton} type="submit">
              Save place
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
