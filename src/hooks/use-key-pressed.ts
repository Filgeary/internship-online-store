/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo } from 'react';

// Дополнять по мере необходимости
export type TKeyboardKeys = 'Enter' | 'ArrowDown' | 'ArrowUp' | 'Escape';

export interface IKeyPressedData {
  key: string;
  isPressed: boolean;
}

export type TKeyPressedOptions<T> = Partial<{
  keys: Array<
    Partial<{
      key: TKeyboardKeys | T; // подходит любая строка, но подсказки будут работать
      preventDefault: boolean;
      callback: (key: string, isPressed: boolean) => void;
      onKeyDown: boolean; // запустить callback на keyDown
      onKeyUp: boolean; // запустить callback на keyUp
    }>
  >;
}>;

/**
 * Позволяет отслеживать нажатия клавиш на выбранном элементе.
 * Ограничение: если в колбэках есть setState (от useState), то
 * он должен использовать колбэк, а не внешнюю переменную при
 * обращении к значению стейта, например `setMenuOpen(prev => !prev)`.
 * То есть, не будут работать внешние переменные созданные useState,
 * значение в них будет устаревшим, в то же времея переменные созданные
 * useRef в `current` будут работать корректно и содержать новое значение.
 */
export default function useKeyPressed<T extends string>(target: HTMLDivElement | null, options?: TKeyPressedOptions<T>) {
  const { keys = [] } = options ?? {};
  const depends = useMemo(() => keys.filter(({ callback }) => callback !== undefined).map(({ callback }) => callback), [keys]);

  const keyDownHandler = useCallback((event: KeyboardEvent) => {
    const opt = keys.find(({ key }) => key === event.key);
    if (!opt) return;
    if (opt.preventDefault !== false) event.preventDefault();
    if (opt.onKeyDown) opt.callback?.(event.key, true);
  }, depends);

  const keyUpHandler = useCallback((event: KeyboardEvent) => {
    const opt = keys.find(({ key }) => key === event.key);
    if (!opt) return;
    if (opt.preventDefault !== false) event.preventDefault();
    if (opt.onKeyUp) opt.callback?.(event.key, false);
  }, depends);

  useEffect(() => {
    if (target) {
      target.addEventListener('keydown', keyDownHandler);
      target.addEventListener('keyup', keyUpHandler);
    }

    return () => {
      target?.removeEventListener('keydown', keyDownHandler);
      target?.removeEventListener('keyup', keyUpHandler);
    };
  }, [target]);
}
