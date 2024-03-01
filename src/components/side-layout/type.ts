import { ReactNode } from "react";

export interface SideLayoutProps {
  children: ReactNode;
  side?: "start" | "end" | "between" | 'top' | 'center';
  padding?: "small" | "medium";
  minHeight?: number,
  direction?: 'row' | 'column'
}
