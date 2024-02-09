export type CategoriesStateType = {
  waiting: boolean;
  list: CategoryType[]
}

export type CategoryType = {
  _id: string;
  title: string;
  parent: CategoryParentType;
  children: CategoryType[];
}

export type CategoryParentType = {
  _id: string;
}
