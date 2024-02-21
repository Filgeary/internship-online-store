import { RefObject } from "react";

export interface DropdownTemplateProps {
  countOfOptions: number;
  renderSelectedItem: (open: boolean) => JSX.Element;
  renderInput: (searchRef: RefObject<HTMLInputElement>) => JSX.Element;
  renderOptions: (focusInd: number) => JSX.Element;
}
