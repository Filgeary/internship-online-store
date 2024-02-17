export type TModalsNames = 'basket' | 'dialogAmount' | 'modalCatalog';

export type TResponse<T> = TSuccessResponse<T> | TErrorResponse;
export type TSuccessResponse<T> = { result: T };
export type TErrorResponse = {
  error: {
    id: number;
    code: string;
    message: string;
    data: {
      issues: TVerboseError[];
    };
  };
};

export type TVerboseError = {
  path: any[];
  rule: string;
  accept: boolean;
  message: string;
};

export type TRecursiveObjectProps<T> = {
  [P in keyof T]: T[P] extends object ? TRecursiveObjectProps<T[P]> : T[P];
};
