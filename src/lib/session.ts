import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { UserModel } from "~/types/user";
import { parseJsonObject } from "~/utils/json";

export const SESSION_MAX_AGE = 24 * 60 * 60; // 1day
export const SESSION_TOKEN_LOCAL = "auth_token";
export const SESSION_USER_LOCAL = "auth_user_data";
export const createSession = () => {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
  return expiresAt;
};

export const handleAfterLogin = (
  cookie: ReadonlyRequestCookies,
  token: string,
  userData: UserModel
) => {
  cookie.set(SESSION_TOKEN_LOCAL, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  cookie.set(SESSION_USER_LOCAL, JSON.stringify(userData), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
};

export const getCookie = (name: string): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const match = document.cookie.match(
    new RegExp("(^|;\\s*)" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : undefined;
};

export const getSessionData = () => {
  const userData = parseJsonObject(getCookie(SESSION_USER_LOCAL), {});
  const token = getCookie(SESSION_TOKEN_LOCAL);

  if (validUserData(userData) && !!token) {
    return { userData, token };
  }

  return null;
};

export const validUserData = (data: Record<string, any>) => {
  if (!data || typeof data !== "object") return false;

  const obj = data as Record<string, unknown>;

  const requiredStringProps = [
    "id",
    "email",
    "name",
    "birthday",
    "avatarUrl",
    "role",
    "createdAt",
    "updatedAt",
  ] as const;

  for (const key of requiredStringProps) {
    if (!obj[key]) {
      return false;
    }
  }

  return true;
};
