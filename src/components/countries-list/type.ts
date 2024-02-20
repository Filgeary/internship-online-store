import { Country } from "@src/store/countries/type";

export interface CountriesListProps {
  countries: Country[],
  selectedItemId: string,
  onSelect: (_id: string[]) => void,
  focusInd: number
}
