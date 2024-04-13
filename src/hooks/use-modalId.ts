import { useState } from "react";
import useSelector from "./use-selector";
import useInit from "./use-init";
import { TState } from "@src/types/type";
/**
 * Получение id для модалки
 */

function useModalId() {
  const [modalId, setModalId] = useState<number | null>(null);

  const id = useSelector((state: TState) => state.modals.lastOpenModalId);

  useInit(() => {
    setModalId(id);
  }, [])

  return modalId;
}

export default useModalId;
