export interface Category {
  title: string;
  _id: string;
}

export interface ICategoriesState {
  list: Category[];
  waiting: boolean;
}
