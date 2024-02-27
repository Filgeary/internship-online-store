import { Country } from "@src/store/countries/type";

export interface CountriesListProps {
  countries: Country[];
  onSelect: (_id: string[]) => void;
  focusInd: {
    index: number;
    mouse: boolean;
  };
  setFocusInd: React.Dispatch<
    React.SetStateAction<{
      index: number;
      mouse: boolean;
    }>
  >;
  selected: string[];
}
