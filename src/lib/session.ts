import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { UserModel } from "~/types/user";
import { parseJsonObject } from "~/utils/json";
import Cookie from "js-cookie";

export const SESSION_MAX_AGE = 1 * 60 * 60 * 1000;
export const SESSION_TOKEN_LOCAL = "auth_token";
export const SESSION_USER_LOCAL = "auth_user_data";
export const createSession = (user: UserModel) => {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
};

export const handleAfterLogin = (
  cookie: ReadonlyRequestCookies,
  token: string,
  userData: UserModel
) => {
  cookie.set(SESSION_TOKEN_LOCAL, token, {
    httpOnly: false, // true if more secure
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE, // 1 ngày
  });

  cookie.set(SESSION_USER_LOCAL, JSON.stringify(userData), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE, // 1 ngày
  });
};

export const getCookie = (name: string) => {
  return Cookie.get(name);
};

export const getSessionData = () => {
  console.log(Cookie.get(SESSION_USER_LOCAL));
  const userData = parseJsonObject(getCookie(SESSION_USER_LOCAL), {});
  const token = getCookie(SESSION_TOKEN_LOCAL);

  console.log(userData, token);
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
