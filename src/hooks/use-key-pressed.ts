/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';

export interface IKeyPressedData {
  key: string;
  isPressed: boolean;
}

export type TKeyPressedOptions = Partial<{
  keys: Array<
    Partial<{
      key: string;
      preventDefault: boolean;
      callback: (key: string, isPressed: boolean) => void;
      onKeyDown: boolean; // запустить callback на keyDown
      onKeyUp: boolean; // запустить callback на keyUp
    }>
  >;
  depends: unknown[];
}>;

/**
 * Позволяет отслеживать нажатия клавиш на выбранном элементе.
 * Ограничение: если в колбэках есть setState (от useState), то
 * он должен использовать колбэк, а не внешнюю переменную при
 * обращении к значению стейта, например `setMenuOpen(prev => !prev)`.
 */
export default function useKeyPressed(target: HTMLDivElement | null, options?: TKeyPressedOptions) {
  const { keys = [], depends = [] } = options ?? {};

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
