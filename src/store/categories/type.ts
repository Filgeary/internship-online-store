interface Category {
  children: Category[],
  parent: {_id: string},
  title: string,
  _id: string
}

export interface InitialStateCategories {
  list: Category[];
  waiting: boolean;
}

export interface ResponseDataCategories {
  result: {
    items: Category[]
  }
}
