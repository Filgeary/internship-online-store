import { useEffect } from 'react';

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 */
export default function useInit(initFunc: Function, depends: any[] = [], backForward = false) {
  useEffect(() => {
    initFunc(false);
    // Если в истории браузера меняются только search-параметры, то react-router не оповестит
    // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
    // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
    if (backForward) {
      // @ts-expect-error We can't verify signature of `initFunc`
      window.addEventListener('popstate', initFunc);

      return () => {
        // @ts-expect-error We can't verify signature of `initFunc`
        window.removeEventListener('popstate', initFunc);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depends);
}
