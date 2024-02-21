import { Country } from "@src/store/countries/type";

export interface DropdownSelectedProps {
  selected: Country[],
  open: boolean;
  removeSelectedItem: (_id: string, e: React.MouseEvent<HTMLLIElement>) => void
}
