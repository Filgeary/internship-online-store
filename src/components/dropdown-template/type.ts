import { RefObject } from "react";

export interface DropdownTemplateProps {
  countOfOptions: number;
  renderSelectedItem: (open: boolean) => JSX.Element;
  renderInput: (searchRef: RefObject<HTMLInputElement>) => JSX.Element;
  renderOptions: (
    focusInd: number,
    menuRef: RefObject<HTMLUListElement>
  ) => JSX.Element;
}

export type ChevronProps = {
  classValue: string
}
