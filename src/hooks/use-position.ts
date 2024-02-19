/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useSyncExternalStore } from 'react';
import throttle from 'lodash.throttle';

export interface IPosition {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IPositionOptions {
  delay: number;
  scrollendListener: boolean;
  resizeListener: boolean;
}

/**
 * Возвращает объект, содержащий расстояния от элемента до границ вьюпорта исключая скролл (left, top, right, bottom).
 * Данные могут (в зависимости от указанных опций) обновляются каждый раз при завершении скролла (событие
 * `scrollend` на `window`) и ресайзе окна (с `lodash.throttle`).
 */
export default function usePosition(target: HTMLDivElement | null, options?: Partial<IPositionOptions>): IPosition {
  const { delay = 100, scrollendListener = false, resizeListener = false } = options ?? {};

  // Функция подписки
  const subscribe = useCallback(
    (callback: () => void) => {
      if (target) {
        if (scrollendListener) window.addEventListener('scrollend', callback);
        if (resizeListener) window.addEventListener('resize', callback);
      }
      return () => {
        window.removeEventListener('scrollend', callback);
        window.removeEventListener('resize', callback);
      };
    },
    [target]
  );

  const callbacks = {
    left: useCallback(
      throttle(() => Number(target?.getBoundingClientRect().left.toFixed()), delay),
      [target]
    ),
    top: useCallback(
      throttle(() => Number(target?.getBoundingClientRect().top.toFixed()), delay),
      [target]
    ),
    right: useCallback(
      throttle(() => Number(target?.getBoundingClientRect().right.toFixed()), delay),
      [target]
    ),
    bottom: useCallback(
      throttle(() => Number(target?.getBoundingClientRect().bottom.toFixed()), delay),
      [target]
    ),
    clientHeight: useCallback(
      throttle(() => Number(document.documentElement.clientHeight), delay),
      []
    ),
    clientWidth: useCallback(
      throttle(() => Number(document.documentElement.clientWidth), delay),
      []
    ),
  };

  // Получаем значения расстояния от левого верхнего угла вьюпорта до элемента,
  // обновляемые при завершении скролла или ресайзе окна
  const left = useSyncExternalStore(subscribe, callbacks.left) ?? 0;
  const top = useSyncExternalStore(subscribe, callbacks.top) ?? 0;
  const right = useSyncExternalStore(subscribe, callbacks.right) ?? 0;
  const bottom = useSyncExternalStore(subscribe, callbacks.bottom) ?? 0;
  // Высота и ширина вьюпорта за исключением скроллбаров
  const clientHeight = useSyncExternalStore(subscribe, callbacks.clientHeight) ?? 0;
  const clientWidth = useSyncExternalStore(subscribe, callbacks.clientWidth) ?? 0;

  return {
    left,
    top,
    right: clientWidth - right,
    bottom: clientHeight - bottom,
  };
}
