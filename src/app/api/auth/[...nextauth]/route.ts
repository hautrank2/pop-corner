// import { JWT } from "next-auth/jwt";
// import NextAuth, { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { UserModel } from "~/types/user";

// const MAX_AGE = +(process.env.NEXTAUTH_MAXAGE || 60 * 60 * 24 * 30);
// export const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: MAX_AGE,
//   },
//   secret: process.env.AUTH_SECRET,
//   callbacks: {
//     async signIn(props: any) {
//       console.log("signin", props);
//       const { account, profile, user } = props;
//       if (account?.provider === "google") {
//         // 1. GET USER
//         const id = (profile as any)?.sub || user?.id;
//         if (!id) {
//           console.error("[signIn] Missing user id (google sub).");
//           return false;
//         }

//         // 2. GET EMAIL
//         const email = user?.email ?? (profile as any)?.email ?? null;
//         const emailVerified =
//           (profile as any)?.email_verified ??
//           (profile as any)?.verified_email ??
//           false;

//         if (!email || !emailVerified) {
//           console.warn("[signIn] Email not verified or missing.");
//           return false;
//         }

//         // 3. Check user exists
//         const users: UserModel[] = await readJsonFile("src/data/user.json");
//         const exists = users.find((u) => u.id === id || u.email === email);

//         if (!exists) {
//           const username = (email && email.split("@")[0]) || id;
//           const data: UserModel = {
//             id,
//             name: user?.name ?? (profile as any)?.name ?? username,
//             image: user?.image ?? (profile as any)?.picture ?? "",
//             email,
//             username,
//           };
//           users.push(data);
//           await writeJsonFile("src/data/user.json", users);
//           return true;
//         }
//         return true;
//       }
//       return false;
//     },
//     async jwt({ token, ...rest }) {
//       console.log("callbacks token", token, rest);
//       const users: UserModel[] = await readJsonFile("src/data/user.json");
//       const findUser = users.find((u) => u.email === token.email);

//       return {
//         ...token,
//         ...findUser,
//       };
//     },
//     async session({ session, token }) {
//       console.log("callbacks session", session, token);
//       const users: UserModel[] = await readJsonFile("src/data/user.json");
//       const findUser = users.find((u) => u.email === token.email);
//       session.user = findUser;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
