import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { httpClient } from "~/api";
import { handleAfterLogin, SESSION_MAX_AGE } from "~/lib/session";
import { LoginResponse } from "~/types/auth";

const MAX_AGE = SESSION_MAX_AGE;

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE,
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn(props: any) {
      const { account, profile, user } = props;
      if (account?.provider === "google") {
        // 1. GET USER
        const id = (profile as any)?.sub || user?.id;
        if (!id) {
          console.error("[signIn] Missing user id (google sub).");
          return false;
        }

        // 2. GET EMAIL
        const email = user?.email ?? (profile as any)?.email ?? null;
        const emailVerified =
          (profile as any)?.email_verified ??
          (profile as any)?.verified_email ??
          false;

        if (!email || !emailVerified) {
          console.warn("[signIn] Email not verified or missing.");
          return false;
        }

        const userRes = await httpClient.post<LoginResponse>(
          "/api/auth/login/email",
          {
            email,
          }
        );
        const { token, ...userData } = userRes.data;
        const cookie = await cookies();
        handleAfterLogin(cookie, token, userData);
        return true;
      }
      return false;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
