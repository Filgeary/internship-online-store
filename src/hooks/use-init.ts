import { useEffect } from "react";
import useServices from "./use-services";

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 * @param initFunc {Function} Пользовательская функция
 * @param depends {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward}}
 */
type TInitFunction = (e?: Event | boolean ) => void | Promise<unknown>;

export default function useInit(
  initFunc: TInitFunction,
  depends: unknown[] = [],
  backForward = false
) {
  const services = useServices();

  
  console.log(services.ssrPromises.ssrRender);
  
  if (services.ssrPromises.ssrRender) {
    const pr = initFunc();
    services.ssrPromises.addPromise(pr);
   // services.ssrPromises.ssrRender = false;
  }

  useEffect(() => {
    if (!services.ssrPromises.ssrRender) {
      initFunc(false);
      // Если в истории браузера меняются только search-параметры, то react-router не оповестит
      // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
      // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
      if (backForward) {
        window.addEventListener("popstate", initFunc);
        return () => {
          window.removeEventListener("popstate", initFunc);
        };
      }
    }
  }, depends);
}
