import type { ReactElement } from "react"

export type PageLayoutProps = {
  head?: ReactElement[] | ReactElement,
  footer?: ReactElement[] | ReactElement,
  children?: ReactElement[] | ReactElement,
}