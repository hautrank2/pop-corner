import { cookies } from "next/headers";
import { SESSION_USER_LOCAL } from "~/lib/session";
import { UserModel } from "~/types/user";

export const getCookies = async (keys: string[]) => {
  const cookieStore = await cookies();
  const results: Record<string, string | null> = {};

  // Fetch each cookie
  keys.forEach((key) => {
    const value = cookieStore.get(key)?.value ?? null;
    results[key] = value;
  });

  return results;
};

export const getUserData = async (): Promise<UserModel | null> => {
  const cookie = await cookies();
  const userJson = cookie.get(SESSION_USER_LOCAL)?.value ?? "";
  if (typeof userJson === "string") {
    const userData = JSON.parse(userJson);
    return userData;
  }
  return null;
};
