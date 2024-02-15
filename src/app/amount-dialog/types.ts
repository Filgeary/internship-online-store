import type { ModalCodes } from "@src/store/modals/types"

export type AmountDialogProps = {
  id: `${ModalCodes.amount}_${number}`,
  extraData: {
    getTitle: (() => Promise<string>) | (() => string)
  },
  background: boolean
}