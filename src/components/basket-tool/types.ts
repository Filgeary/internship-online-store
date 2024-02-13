export type BasketToolPropsType = {
  sum: number;
  amount: number;
  t: (text: string, plural?: number) => string;
  onOpen: () => void;
}
