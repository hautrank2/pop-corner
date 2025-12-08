import { cookies } from "next/headers";
import { createHttpClient } from "~/api";
import { SESSION_TOKEN_LOCAL } from "~/lib/session";

export const httpServer = async () => {
  const cookie = await cookies();
  const token = cookie.get(SESSION_TOKEN_LOCAL);

  return createHttpClient({
    baseURL: process.env.API_ENDPOINT ?? "",
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
