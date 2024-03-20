import React from "react";

export interface OptionType {
  _id: string,
  title: string,
  code: string,
  select?: boolean
}

export interface AutocompleteProps {
  filteredOptions: OptionType[],
  inputBuilder: (props: any) => JSX.Element,
  onSelect: (value: string) => void;
  optionsBuilder: (inputValue: string) => void;
  optionsViewBuilder: (props: any) => React.ReactNode;
  visible?: boolean;
}
