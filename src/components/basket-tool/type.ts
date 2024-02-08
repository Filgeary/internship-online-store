import { Text } from "@src/i18n/translate";

export interface BasketToolProps {
  sum: number;
  amount: number;
  onOpen: () => void;
  t: (text: Text, number?: number) => string;
}
