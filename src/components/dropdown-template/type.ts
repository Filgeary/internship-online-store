import { RefObject } from "react";

export interface DropdownTemplateProps {
  countOfOptions: number;
  renderSelectedItem: (open: boolean) => JSX.Element;
  renderInput: (
    searchRef: RefObject<HTMLInputElement>,
    setFocusInd: React.Dispatch<React.SetStateAction<number>>
  ) => JSX.Element;
  renderOptions: (
    focusInd: number,
    menuRef: RefObject<HTMLUListElement>
  ) => JSX.Element;
}

export type ChevronProps = {
  classValue: string
}
