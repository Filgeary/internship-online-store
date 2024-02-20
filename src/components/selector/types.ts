import { CountryType } from "../../store/countries/types";

export type SelectorPropsType = {
  selected: string;
  options: CountryType[];
  onChange: (id: string) => void;
}
