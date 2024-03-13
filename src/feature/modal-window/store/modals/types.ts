interface IModal {
  name: string,
  data: any,
  resolve: (value: unknown) => void,
  _id: number
}

export type TModal = IModal

export type TModalName = 'adding' | 'modalList' | 'basket'
