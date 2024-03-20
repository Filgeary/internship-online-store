export interface ItemSelectProps {
  item: IArticle,
  onSelect: (_id: number | string, quantity: number, select: boolean) => void,
  labelCurr?: string,
  select: number,
  labelAdd: string
}
