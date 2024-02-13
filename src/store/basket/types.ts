export interface IBasketStateResponseItemAPI {
  result: {
    _id: string;
    title: string;
    price: number;
  };
}

export interface IBasketStateResponseItemsAPI {
  result: {
    items: {
      _id: string;
      title: string;
      price: number;
    }[];
  };
}

interface IBasketItem {
  _id: string;
  title: string;
  price: number;
  amount: number;
}

export interface IBasketInitState {
  list: IBasketItem[];
  sum: number;
  amount: number;
  waiting: boolean;
}
