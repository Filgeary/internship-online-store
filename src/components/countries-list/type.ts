import { Country } from "@src/store/countries/type";

export interface CountriesListProps {
  countries: Country[];
  onSelect: (_id: string[]) => void;
  focusInd: number;
  selected: string[];
}
