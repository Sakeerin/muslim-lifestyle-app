import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!email || !password || !adminEmail || !adminPasswordHash) {
          return null;
        }

        if (email !== adminEmail) {
          return null;
        }

        const isValid = await compare(password, adminPasswordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: "admin",
          email: adminEmail,
          role: "ADMIN",
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "USER" | undefined;
      }

      return session;
    },
  },
});
