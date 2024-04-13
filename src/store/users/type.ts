import { GetProp, TablePaginationConfig, TableProps } from "antd";
import { Profile } from "../profile/type"

export type InitialStateUsers = {
  waiting: boolean;
  count: number;
  totalCount: number,
  newCount: number;
  confirmCount: number;
  rejectCount: number;
  users?: Profile[];
};

export type Params = {
  pagination?: TablePaginationConfig;
  field?: string;
  order?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
};
