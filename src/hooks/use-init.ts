import { useEffect } from 'react'
import useServices from './use-services'
/**
 * Хук для асинхронных расчётов, которые будут исполнены при первом рендере или изменении depends.
 */
export default function useInit(initFunc: (arg?: Event | boolean) => void, depends = [], backForward = false) {
  console.log('process.env.IS_SERVER === true =', process.env.IS_SERVER)

  if(process.env.IS_SERVER === 'true') {
    const pr = initFunc() as unknown as Promise<any>
    const services = useServices()
    services.server.addPromise(pr)
  }

  useEffect(() => {
     initFunc(false);
    // Если в истории браузера меняются только search-параметры, то react-router не оповестит
    // компонент об изменениях, поэтому хук можно явно подписать на событие изменения истории
    // браузера (если нужно отреагировать на изменения search-параметров при переходе по истории)
    if (backForward) {
      window?.addEventListener('popstate', initFunc);
      return () => {
        window?.removeEventListener('popstate', initFunc);
      };
    }
  }, depends);
}
