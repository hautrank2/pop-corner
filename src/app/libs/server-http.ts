import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { HttpError } from "~/api";
import { SESSION_TOKEN_LOCAL } from "~/lib/session";

const baseURL = process.env.API_ENDPOINT ?? "";
export const httpServer = async () => {
  const cookie = await cookies();
  const tokenData = cookie.get(SESSION_TOKEN_LOCAL);

  const token = tokenData ? tokenData?.value : "";
  const instance = axios.create({
    ...(baseURL ? { baseURL } : {}),
    timeout: 10000,
    withCredentials: true,
    maxRedirects: 0,
  });

  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      if (token) {
        requestConfig.headers.set("Authorization", `Bearer ${token}`);
      }
      return requestConfig;
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: HttpError) => {
      return Promise.reject(error);
    }
  );

  return instance;
};
