export type TModalsState = {
  mapOfOpened: TMapOfOpened;
  lastOpened: string | null;
};

export type TModalsConfig = {
  onlyUnique: boolean;
};

export type TOpenedModal = {
  name: TModalsNames;
  resolve: (...value: any[]) => void;
  reject: (...value: any[]) => void;
};

export type TMapOfOpened = Record<TModalsNames | string, TOpenedModal>;
