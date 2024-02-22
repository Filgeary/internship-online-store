export interface ICountries {
  items: ICountry[];
  count: number;
}

export interface ICountry {
  _id: string;
  _type: string;
  order: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
  isNew: boolean;
  proto: Proto;
  code: string;
  title: string;
  description: string;
  flag: Flag;
}

interface Proto {
  _id: string;
  _type: string;
}

interface Flag {
  _id: string;
  _type: string;
}
