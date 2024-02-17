export type TModalsNames = 'basket' | 'dialogAmount' | 'modalCatalog';

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
export type TResponse<T> = TSuccessResponse<T> | TErrorResponse;

export type TVerboseError = {
  path: any[];
  rule: string;
  accept: boolean;
  message: string;
};

// TODO: show recursive type
const product = {
  category: {
    _id: '123',
    _type: 'category',
    data: {
      _id: '456',
      _type: 'sub-category',
    },
  },
  data: {
    _id: '123',
    _type: 'productData',
  },
};

export type TRecursiveObjectProps<T> = {
  [P in keyof T]: T[P] extends object ? TRecursiveObjectProps<T[P]> : T[P];
};

// example
{
  type TProduct = TRecursiveObjectProps<typeof product>;
  const fn = (obj: TProduct) => obj.category.data._type;
  fn(product);
}
