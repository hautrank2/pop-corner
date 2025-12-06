import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { httpClient } from "~/api";
import { SESSION_MAX_AGE } from "~/lib/session";
import { TableResponse } from "~/types/query";
import { UserModel } from "~/types/user";

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
    /*** SIGN IN VALIDATION ***/
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") return false;

      // 1. Lấy email
      const email =
        user?.email ||
        (profile as any)?.email ||
        null;

      const emailVerified =
        (profile as any)?.email_verified ||
        (profile as any)?.verified_email ||
        false;

      if (!email || !emailVerified) {
        console.error("[signIn] Email missing or not verified.");
        return false;
      }

      // 2. Kiểm tra user có tồn tại trong DB chưa
      try {
        const res = await httpClient.get<TableResponse<UserModel>>(`/api/user`, {
          params: { email },
        });

        const existUser = res.data.items?.[0];
        if (!existUser) return false;

        // 3. Lưu user vào object user để session + jwt dùng
        (user as any).dbUser = existUser;
        return true;
      } catch (err) {
        console.error("[signIn] API error:", err);
        return false;
      }
    },

    /*** JWT: Lưu DB user vào JWT token ***/
    async jwt({ token, user }) {
      if ((user as any)?.dbUser) {
        token.dbUser = (user as any).dbUser;
      }
      return token;
    },

    /*** SESSION: Đưa dbUser xuống FE ***/
    async session({ session, token }) {
      if (token.dbUser) {
        session.user = {
          ...session.user,
          ...token.dbUser,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
