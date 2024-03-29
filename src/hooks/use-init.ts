import { useEffect } from 'react';
import useServices from './use-services';
import useStore from './use-store';

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 * @param initFunc {Function} Пользовательская функция
 * @param depends {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward}}
 */
export default function useInit(
  initFunc: TInitFunction,
  depends: unknown[] = [],
  backForward = false
) {
  console.log('Global is:', typeof global);
  // Ветка выполнения на сервере
  if (typeof global === 'object') {
    const promiseRes = initFunc();
    const services = useServices();

    services.suspense.appendPromise(promiseRes);
  }

  useEffect(() => {
    initFunc(false);
    // Если в истории браузера меняются только search-параметры, то react-router не оповестит
    // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
    // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
    if (backForward) {
      window.addEventListener('popstate', initFunc);
      return () => {
        window.removeEventListener('popstate', initFunc);
      };
    }
  }, depends);
}

export type TInitFunction = (e?: Event | boolean) => Promise<unknown>;
