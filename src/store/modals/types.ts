import * as modals from "@src/app/export-modals";

type importModals = typeof modals;
export type ModalKeys = keyof importModals;

export interface IModalsInitState {
  list: {
    name: ModalKeys;
    id: string;
    resolve: (value: any) => void;
  }[];
}