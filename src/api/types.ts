export type ApiRequest = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
} & RequestInit;

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: any;
}

export type APIConfig = {
  baseUrl: string;
};
