import { RefObject } from "react";

export interface DropdownTemplateProps {
  countOfOptions: number;
  renderSelectedItem: () => JSX.Element;
  renderInput: (searchRef: RefObject<HTMLInputElement>) => JSX.Element;
  renderOptions: (focusInd: number) => JSX.Element;
}
