import { UserModel } from "~/types/user";

export const SESSION_MAX_AGE = 1 * 60 * 60 * 1000;
export const SESSION_TOKEN_LOCAL = "auth_token";
export const SESSION_USER_LOCAL = "auth_user_data";
export const createSession = (user: UserModel) => {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
};
