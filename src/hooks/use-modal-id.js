import { useEffect, useState } from "react";
import useSelector from "./use-selector";

function useModalId() {
  const uid = useSelector((state) => state.modals.lastOpened);
  const [modalId, setModalId] = useState(null);

  useEffect(() => {
    setModalId(modalId ?? uid);
  }, [modalId, uid]);

  return modalId;
}

export default useModalId;
