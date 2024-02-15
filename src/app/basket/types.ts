import type { ModalCodes } from "@src/store/modals/types"

export type BasketProps = {
  id: `${ModalCodes.basket}_${number}`,
  background: boolean
}