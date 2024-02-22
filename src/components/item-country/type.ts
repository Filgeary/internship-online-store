import { MouseEvent } from "react"

export interface ItemCountryProps {
  title?: string;
  code?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}
