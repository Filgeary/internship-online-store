import { ReactNode } from "react";
import { CountryType } from "../../store/countries/types";

export type SelectorPropsType = {
  selected: CountryType[];
  selectOneRender: (item: CountryType) => ReactNode;
  selectMultiRender: (item: CountryType) => ReactNode;
  options: CountryType[];
  dropdownItem: (item: CountryType, isSelected?: boolean, isHovered?: boolean) => ReactNode;
  onChange: (id: string[]) => void;
  filter: string;
  onChangeFilter: (text: string) => void;
}

