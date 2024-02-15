//@todo разбить модалки на типы

export enum ModalCodes {
  basket = 'basket',
  amount = 'amount',
  selectItems = 'selectItems',
  // При добавлении новой модалки передается её код
}

interface Modal {
  _id: `${ModalCodes}_${number}`
  type: ModalCodes,
}

interface BasketModal extends Modal {
  type: ModalCodes.basket,
  extraData?: never,
  resolve?: never
}

interface AmountModal extends Modal {
  type: ModalCodes.amount,
  extraData: {
    getTitle: () => Promise<string>,
  },
  resolve: (amount: number | undefined) => void
}

interface SelectItemsModal extends Modal {
  type: ModalCodes.selectItems,
  extraData: {
    getTitle: () => string,
    getLabelSubmit: () => string
  },
  resolve: (ids: string[] | undefined) => void
}


// При добавлении новой модалки передается её интерфейс
export type Modals = {
  basket: BasketModal,
  amount: AmountModal,
  selectItems: SelectItemsModal
}

export interface ModalsState {
  readonly stack: Modals[keyof Modals][]
}

export type ModalsConfig = {}