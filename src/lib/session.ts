import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { UserModel } from "~/types/user";

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
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE, // 1 ngày
  });

  cookie.set(SESSION_USER_LOCAL, JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE, // 1 ngày
  });
};
