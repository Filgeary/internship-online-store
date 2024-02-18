import { Lang } from "@src/i18n/type";

export interface SelectProps {
  options: {
    value: Lang | string;
    title: string;
  }[];
  value: Lang | string;
  onChange: (value: Lang & string) => void;
}
