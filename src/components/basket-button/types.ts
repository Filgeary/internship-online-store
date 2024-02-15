import type { MouseEvent, ReactElement } from "react"

export type BasketButtonProps = {
  children: ReactElement | string,
  onClick: (e: MouseEvent) => void
}