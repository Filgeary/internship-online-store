import { type Tt } from '@src/i18n/context';

export interface IBasketToolProps {
  sum: number;
  amount: number;
  onOpen: (event?: React.MouseEvent) => void;
  t: Tt;
}
