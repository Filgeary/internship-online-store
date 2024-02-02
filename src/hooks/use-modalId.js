import { useState, useEffect } from "react";
import useSelector from "./use-selector";
/**
 * Получение id для модалки
 */

function useModalId() {
  const [modalId, setModalId] = useState(null);

  const id = useSelector((state) => state.modals.lastOpenModalId);

  useEffect(() => {
    setModalId(id);
  }, [])

  return modalId;
}

export default useModalId;
