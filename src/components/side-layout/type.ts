import { ReactNode } from "react";

export interface SideLayoutProps {
  children: ReactNode;
  side?: "start" | "end" | "between" | 'top';
  padding?: "small" | "medium";
  minHeight?: number
}
