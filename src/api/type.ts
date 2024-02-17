export type RequestArgs = Api & {
  url: string;
  method?: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  headers?: Record<string, string>;
}

interface Api {
  [key: string]: string;
}

export interface ResponseApi<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ConfigApi {
  baseUrl: string
}
