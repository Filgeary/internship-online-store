import * as modals from './export';

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

/// Типы для открытия и промиса

export type ModalsKeys = keyof typeof modals;

// type a = Parameters<typeof modals['addToBasket']>
// type b = Parameters<Parameters<typeof modals['addToBasket']>[0]['close']>

/**
 * Список модальных окон с возвращаемым в Promice типом данных
 */
export type ModalsReturnType = {
  [key in ModalsKeys]: Parameters<Parameters<typeof modals[key]>[0]['close']>[0]
}

