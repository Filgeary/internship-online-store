import { ReactNode } from "react";

export interface DropdownTemplateProps {
  renderSelectedItem: () => JSX.Element;
  renderInput: () => JSX.Element;
  renderOptions: () => JSX.Element;
}
