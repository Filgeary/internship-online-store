import type { ModalCodes } from "@src/store/modals/types";

export type SelectItemsModalProps = {
  id: `${ModalCodes.selectItems}_${number}`,
  background: boolean,
  extraData?: {
    getTitle: () => string
    getLabelSubmit: () => string
  },
}