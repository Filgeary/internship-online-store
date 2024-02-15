import type { TranslateFn } from "@src/i18n/types"
import type { MouseEvent } from "react"

export type BasketToolProps = {
  sum: number,
  amount: number,
  onOpen: (e: MouseEvent) => void,
  t: TranslateFn
}