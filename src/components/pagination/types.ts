export type PaginationPropsType = {
  page: number;
  limit: number;
  count: number;
  indent?: number;
  onChange: (value: number) => void;
  makeLink: (value: number) => string;
}
