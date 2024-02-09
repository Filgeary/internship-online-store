export interface InitialStateModals {
  list: {
    name: string;
    id: number;
    resolve: (value: unknown) => void | PromiseLike<void>;
  }[];
  lastOpenModalId: number;
}

// export type NameModal = "basket" | "count" | "catalogModal";
