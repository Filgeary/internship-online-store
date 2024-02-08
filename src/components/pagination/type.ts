export interface PaginationProps {
  page: number;
  limit: number;
  count: number;
  indent: number;
  onChange: (number: number) => void;
  makeLink: (number: number) => string;
}
