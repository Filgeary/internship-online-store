import { ReactNode } from "react";

export interface PageLayoutProps {
  head?: JSX.Element;
  footer?: JSX.Element;
  children: ReactNode;
}
