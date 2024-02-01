import {useLayoutEffect, useMemo, useState} from "react";
import useModal from "./use-modal";

/**
 * Хук для получения стека modal и отслеживания изменения}
 * @return {*}
 */
export default function useModalsStack() {
  const modal = useModal();

  const [state, setState] = useState(modal.stack);

  const unsubscribe = useMemo(() => {
    return modal.subscribe(() => {
      const newState = modal.stack
      setState(prevState => prevState === newState ? prevState : newState);
    });
  }, []);

  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
