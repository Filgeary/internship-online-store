import type { ReactElement } from "react"

export type FieldProps = {
  label?: string,
  error?: string,
  children?: ReactElement | ReactElement[]
}