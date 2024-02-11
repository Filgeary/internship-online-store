export type TCategoriesState = {
  list: TCategory[];
  waiting: boolean;
};

export type TCategory = {
  _id: string;
  title: string;
  parent: { _id: string };
  children: TCategory[];
};
