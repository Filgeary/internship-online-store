export interface InitialStateModals {
  list: {
    name: NameModal;
    id: number;
    resolve: Function;
  }[];
  lastOpenModalId: number;
}

export type NameModal = "basket" | "count" | "catalogModal";
