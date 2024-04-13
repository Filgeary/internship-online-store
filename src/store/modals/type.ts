export interface InitialStateModals {
  list: {
    name: ModalsName;
    id: number;
    resolve: (value: string[] | string | number) => void | PromiseLike<void>;
  }[];
  lastOpenModalId: number;
}

export type ModalsName = "basket" | "count" | "catalog_modal" | "add_product" | "edit_product"
