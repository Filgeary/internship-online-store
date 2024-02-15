export type PaginationProps = {
  count: number,
  limit: number,
  page: number, 
  indent: number,
  makeLink: (page: number) => string
  onChange: (page: number) => void
}