import { useEffect, useState } from 'react';
import { useAppSelector } from './use-selector';

/**
 * Хук для получения идентификатора модального окна
 * @returns {String}
 */
function useModalId(): string {
  const uid = useAppSelector((state) => state.modals.lastOpened);
  const [modalId, setModalId] = useState(null);

  useEffect(() => {
    setModalId(modalId ?? uid);
  }, [modalId, uid]);

  return modalId;
}

export default useModalId;
