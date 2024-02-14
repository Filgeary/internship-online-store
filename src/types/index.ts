export type TModalsNames = "basket" | "dialogAmount" | "modalCatalog";

export type TResponse<T> = { result: T; };
export type TErrorResponse = {
  error: {
    id: number;
    code: string;
    message: string;
    data: { issues: any; };
  };
};
