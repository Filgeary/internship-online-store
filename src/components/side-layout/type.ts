import { ReactNode } from "react";

export type SideLayoutPropsType = {
  children: ReactNode;
  side?: 'start' | 'end' | 'between';
  padding?: 'small' | 'medium';
}
