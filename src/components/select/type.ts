import { Lang } from "@src/i18n/type";

export interface SelectProps {
  options: {
    value: Lang;
    title: string;
  }[];
  value: Lang;
  onChange: (value: Lang) => void;
}
