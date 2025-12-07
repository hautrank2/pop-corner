import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { getSessionData } from "~/lib/session";

export interface HttpError extends AxiosError {
  _retry?: boolean;
}

export interface HttpResponse<T = unknown> {
  status: number | string | null;
  statusText: string | null;
  data: T;
  dataNotFound?: Record<string, never>;
}

type CreateHttpClientOptions = {
  baseURL?: string | null; // null/undefined => không set baseURL
  config?: AxiosRequestConfig;
};

export const createHttpClient = (
  options?: CreateHttpClientOptions
): AxiosInstance => {
  const { baseURL, config } = options || {};

  const instance = axios.create({
    // chỉ set baseURL nếu có
    ...(baseURL ? { baseURL } : {}),
    timeout: 10000,
    withCredentials: true,
    ...config,
  });

  // Request interceptor: get token
  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const sessionData = getSessionData();

      console.log(sessionData);
      if (sessionData?.token) {
        requestConfig.headers.set(
          "Authorization",
          `Bearer ${sessionData.token}`
        );
      } else {
        // nếu muốn, có thể xóa header khi không còn token
        if (requestConfig.headers?.Authorization) {
          delete requestConfig.headers.Authorization;
        }
      }

      return requestConfig;
    }
  );

  // Response interceptor: xử lý lỗi chung
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: HttpError) => {
      // Ví dụ: nếu token hết hạn
      if (error.response?.status === 401) {
        // TODO: clear session, redirect /login, v.v.
        // clearSession();
        // router.push("/login");
      }

      return Promise.reject(error);
    }
  );
  return instance;
};

// --- Clients cụ thể ---

// External API (.NET, microservice, ...)
export const httpClient = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT ?? undefined,
});

// Internal Next.js API (/api/...)
export const internalHttpClient = createHttpClient({ baseURL: "" });
