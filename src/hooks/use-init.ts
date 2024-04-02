import { useEffect } from 'react';

import { logger } from '@src/utils/logger';
import useServices from './use-services';

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 */
export default function useInit(
  initFunc: () => Promise<unknown> | unknown,
  depends: any[] = [],
  { ssrKey, backForward = false }: { ssrKey?: string; backForward?: boolean } = {},
) {
  const ssrService = useServices().ssr;

  if (ssrService.config.isActive && ssrKey) {
    if (!ssrService.hasKey(ssrKey)) {
      logger.info('useInit', ssrKey);
      try {
        const promiseLike = initFunc();
        if (promiseLike instanceof Promise) {
          ssrService.setPromiseAndExecute(ssrKey, promiseLike);
        }
      } catch (e) {
        logger.error(e);
      }
    }
  }

  useEffect(() => {
    if (!ssrKey || !ssrService.hasKey(ssrKey)) {
      logger.info('useInit', 'useEffect', ssrKey);
      initFunc();
    } else {
      if (ssrKey) {
        ssrService.deletePromise(ssrKey);
      }
    }
    // Если в истории браузера меняются только search-параметры, то react-router не оповестит
    // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
    // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
    if (backForward) {
      window.addEventListener('popstate', initFunc);

      return () => {
        window.removeEventListener('popstate', initFunc);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depends);
}
