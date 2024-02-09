export type TModalsState = {
  mapOfOpened: Record<string, TOpenedModal> | {};
  lastOpened: string | null;
};

type TOpenedModal = {
  name: TModalsNames;
  resolve: (...value: any[]) => void;
  reject: (...value: any[]) => void;
};
