import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

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

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: HttpError) => {
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
