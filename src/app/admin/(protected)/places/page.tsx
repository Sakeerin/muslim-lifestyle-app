import Link from "next/link";
import { PlaceType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PlacePicker } from "@/components/admin/place-picker";
import styles from "../admin.module.css";

function toOptionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

async function createPlace(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));

  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return;
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
}

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    where: { isVerified: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Places Manager</h1>
          <p className={styles.subtitle}>
            List verified places and add coordinates with the map picker.
          </p>
        </div>
        <Link href="/places" className={styles.linkButton}>
          Open public map
        </Link>
      </header>

      <section>
        <h2 style={{ marginBottom: "0.65rem" }}>Verified Places</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Coordinates</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {places.length === 0 ? (
                <tr>
                  <td colSpan={4}>No verified places yet.</td>
                </tr>
              ) : null}

              {places.map((place) => (
                <tr key={place.id}>
                  <td>
                    <strong>{place.name}</strong>
                  </td>
                  <td>{place.type === "MOSQUE" ? "Mosque" : "Halal Food"}</td>
                  <td>
                    {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
                  </td>
                  <td>{place.address ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
