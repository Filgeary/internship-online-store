import { RefObject } from "react";

export interface DropdownTemplateProps {
  countOfOptions: number;
  renderSelectedItem: (open: boolean) => JSX.Element;
  renderInput: (
    searchRef: RefObject<HTMLInputElement>,
    setFocusInd: React.Dispatch<
      React.SetStateAction<{
        index: number;
        mouse: boolean;
      }>
    >
  ) => JSX.Element;
  renderOptions: (
    focusInd: {
      index: number;
      mouse: boolean;
    },
    setFocusInd: React.Dispatch<
      React.SetStateAction<{
        index: number;
        mouse: boolean;
      }>
    >,
    menuRef: RefObject<HTMLUListElement>
  ) => JSX.Element;
}

export type ChevronProps = {
  classValue: string
}
