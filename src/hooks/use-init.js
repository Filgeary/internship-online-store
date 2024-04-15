import { useEffect } from "react";
import useServices from "./use-services";

/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 * @param initFunc {Function} Пользовательская функция
 * @param depends {Array} Значения при смене которых callback снова исполнится.
 * @param options {{backForward}}
 */
export default function useInit(initFunc, depends = [], ssr = undefined, backForward = false) {
  const services = useServices();

  if (services.SSR && !services.promises.isAdded(ssr)) {
    const pr = initFunc();
    services.promises.addPromise(pr, ssr);
  }

  useEffect(() => {
    if(!services.promises.isAdded(ssr)) {
      const pr = initFunc(false);
      // Если в истории браузера меняются только search-параметры, то react-router не оповестит
      // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
      // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
      if (backForward) {
        window.addEventListener("popstate", initFunc);
        return () => {
          window.removeEventListener("popstate", initFunc);
        };
      }
      //throw(pr);
    } else {
      services.promises.delete(ssr)
    }
  }, depends);
}
