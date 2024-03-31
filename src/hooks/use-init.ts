import { useEffect } from "react";
import useServices from "./use-services";

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 * @param initFunc {Function} Пользовательская функция
 * @param depends {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward}}
 */
type TInitFunction = (e?: Event | boolean ) => void;

export default function useInit(
  initFunc: TInitFunction,
  depends: unknown[] = [],
  backForward = false
) {
  const services = useServices();
  
  if (!services.ssrPromises.ssrRender && services.store.actions.categories.getState().list.length>0) {
    services.ssrPromises.clear()
  }else if(!services.ssrPromises.ssrRender && services.store.actions.categories.getState().list.length<=0){
    console.log('false', 'ssr');

    const pr = initFunc();
    services.ssrPromises.addPromise(pr);
  }

  useEffect(() => {
    if (services.ssrPromises.ssrRender) {
      console.log('true', 'client');
      
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
