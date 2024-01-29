import {useLayoutEffect, useMemo, useState} from "react";
import useModal from "./use-modal";

/**
 * Хук для получения активной modal и отслеживания изменения}
 * @return {*}
 */
export default function useActiveModal() {
  const modal = useModal();

  const [state, setState] = useState(modal.activeName);

  const unsubscribe = useMemo(() => {
    return modal.subscribe(() => {
      const newState = modal.activeName
      setState(prevState => prevState === newState ? prevState : newState);
    });
  }, []);

  useLayoutEffect(() => unsubscribe, [unsubscribe]);

  return state;
}
