export interface ICategories {
  items: ICategory[];
  count: number;
}

export interface ICategory {
  _id: string;
  _type: string;
  order: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
  isNew: boolean;
  proto: Proto;
  name: string;
  title: string;
  description: string;
  photo: Photo;
  parent: Parent;
}

interface Proto {
  _id: string;
  _type: string;
}

interface Photo {
  _id: string;
  _type: string;
}

interface Parent {
  _id: string;
  _type: string;
}
