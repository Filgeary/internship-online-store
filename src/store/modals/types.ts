export type ModalsStateType = {
  modals: {
    [key: string]: ModalType
  }
}

export type ModalType<T = any, U = any> = {
  id:string;
  name: string;
  initialData?: T;
  close: (value?: U) => void;
}
