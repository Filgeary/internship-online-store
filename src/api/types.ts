export type TRequest = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  timeout?: number;
} & Partial<any>; // Для rest-параметра options

export type TResponse<T> = {
  data: {
    result: T;
    error: {
      data: {
        issues: Array<{
          path: Array<any>;
          rule?: string;
          accept: boolean;
          message: string;
        }>;
      };
    };
  };
  status: number;
  headers: Record<string, any>;
};
