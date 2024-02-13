export interface ICategoriesInitState {
  list: ICategory[];
  waiting: boolean;
}

export interface ICategoriesResponse {
  result: {
    items: ICategory[];
  };
}

export interface ICategory {
  _id: string;
  title: string;
  parent: {
    _id: string;
  };
  children: ICategory[];
}
