import { Country } from "@src/store/countries/type";

export interface DropdownType {
  value: string;
  onChange: (ids: string[]) => void
  options: Country[]
}
