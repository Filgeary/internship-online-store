export interface IPaginationProps {
  page: number;
  limit: number;
  count: number;
  indent: number;
  onChange: (value: number | null) => void;
  makeLink: (value: number) => string;
}
