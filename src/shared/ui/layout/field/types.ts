import {ReactNode} from "react";

export interface FieldProps {
  label?: string,
  error?: string[],
  children?: ReactNode
}
