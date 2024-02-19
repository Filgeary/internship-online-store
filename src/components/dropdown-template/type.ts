import { RefObject } from "react";

export interface DropdownTemplateProps {
  renderSelectedItem: () => JSX.Element;
  renderInput: (searchRef: RefObject<HTMLInputElement>) => JSX.Element;
  renderOptions: () => JSX.Element;
}
