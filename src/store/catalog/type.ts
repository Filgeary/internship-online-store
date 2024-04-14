import { FilterValue } from "antd/es/table/interface";
import type { Article } from "../article/type";

export interface InitialStateCatalog {
  list: Article[] | [];
  params: Params;
  count: number;
  selected: string[];
  waiting: boolean;
}

export interface Params {
  page: number;
  limit: number;
  sort: string | React.Key | readonly React.Key[];
  query: string | FilterValue;
  category: string | FilterValue;
  madeIn: string | FilterValue;
}

export type InitConfigCatalog = {
  ignoreURL: boolean;
};
