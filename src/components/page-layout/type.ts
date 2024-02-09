import { ReactNode } from "react";

export type PageLayoutType = {
  children: ReactNode;
  head?: ReactNode;
  footer?: ReactNode;
}
