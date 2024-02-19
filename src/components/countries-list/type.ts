import { Country } from "@src/store/countries/type";

export interface CountriesListProps {
  countries: Country[],
  selectedItemId?: string,
  onSelect: (data: Country) => void
}
