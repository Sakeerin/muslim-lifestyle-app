import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { safeCallbackUrl } from "@/app/admin/_utils";
import styles from "./page.module.css";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    callbackUrl?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const hasError = query.error === "invalid";
  const callbackUrl = safeCallbackUrl(query.callbackUrl);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Admin CMS</p>
        <h1>Sign in to continue</h1>
        <p className={styles.subtitle}>
          Use your configured admin credentials to manage lessons, duas, and places.
        </p>

        {hasError ? (
          <p className={styles.error}>Invalid email or password. Please try again.</p>
        ) : null}

        <form
          className={styles.form}
          action={async (formData) => {
            "use server";

            const email = String(formData.get("email") ?? "").trim();
            const password = String(formData.get("password") ?? "");
            const safe = safeCallbackUrl(callbackUrl);

            if (!email || !password) {
              redirect(`/admin/login?error=invalid&callbackUrl=${encodeURIComponent(safe)}`);
            }

            try {
              await signIn("credentials", {
                email,
                password,
                redirectTo: safe,
              });
            } catch (error) {
              if (error instanceof AuthError) {
                redirect(
                  `/admin/login?error=invalid&callbackUrl=${encodeURIComponent(safe)}`,
                );
              }

              throw error;
            }
          }}
        >
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>

          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
