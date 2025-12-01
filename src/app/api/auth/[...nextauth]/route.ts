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
    async signIn(props: any) {
      const { account, profile, user } = props;
      if (account?.provider === "google") {
        console.log(account, profile, user);
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

        // 3. Check user exists
        const usersRes = await httpClient.get<TableResponse<UserModel>>(
          `/api/user`,
          {
            params: { email },
          }
        );
        const existUser = usersRes.data.items[0];
        return !!existUser;
      }
      return false;
    },
    async jwt({ token, ...rest }) {
      console.log("callbacks jwt", { token, rest });
      return {
        ...token,
      };
    },
    async session({ session, token }) {
      console.log("callbacks session", session, token);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
