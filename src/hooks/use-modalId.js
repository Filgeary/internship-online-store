import { useState } from "react";
import useSelector from "./use-selector";
import useInit from "./use-init";
/**
 * Получение id для модалки
 */

function useModalId() {
  const [modalId, setModalId] = useState(null);

  const id = useSelector((state) => state.modals.lastOpenModalId);

  useInit(() => {
    setModalId(id);
  }, [])

  return modalId;
}

export default useModalId;
