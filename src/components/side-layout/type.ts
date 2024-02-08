import { ReactNode } from "react";

export interface SideLayoutProps {
  children: ReactNode;
  side?: "start" | "end" | "between";
  padding?: "small" | "medium";
}
