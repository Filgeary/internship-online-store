import { Lang } from "@src/i18n/type";

export interface SelectProps {
  options: {
    value: Lang | string | number;
    title: string;
  }[];
  value: Lang | string | number;
  onChange: (value: Lang & string & number) => void;
}
