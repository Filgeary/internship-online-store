//@todo разбить модалки на типы

export enum EModalTypes {
  basket = 'basket',
  amount = 'amount',
  selectItems = 'selectItems',
}

export interface IModal {
  readonly type: EModalTypes,
  readonly extraData?: object,
  readonly resolve?: Function,
  readonly _id: number
}

export interface IModalState {
  readonly stack: IModal[]
}