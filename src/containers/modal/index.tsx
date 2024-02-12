import React, { useCallback, useRef, memo, useEffect } from 'react';

import useStore from '@src/hooks/use-store';
import useOnClickOutside from '@src/hooks/use-on-click-outside';
import useModalId from '@src/hooks/use-modal-id';

import ModalLayout from '@src/components/modal-layout';
import { useAppSelector } from '@src/hooks/use-selector';

type ModalProps = {
  title?: string;
  children?: React.ReactNode;
  labelClose?: string;
  onClose?: () => void;
};

const defaultProps: ModalProps = {
  title: 'Модалка',
  labelClose: 'Закрыть',
};

Modal.defaultProps = defaultProps;

function Modal({ children, ...props }: ModalProps) {
  const store = useStore();
  const select = useAppSelector((state) => ({
    modals: state.modals.mapOfOpened,
  }));

  const modalId = useModalId();
  const modalRef = useRef(null);

  const callbacks = {
    closeModal: useCallback(() => {
      store.actions.modals.closeById(modalId);
    }, [store, modalId]),
  };

  const closeHandler = props.onClose || callbacks.closeModal;

  useOnClickOutside(modalRef, closeHandler);

  useEffect(() => {
    modalRef.current?.focus();
  }, [select.modals]);

  return (
    <ModalLayout {...props} ref={modalRef} onClose={closeHandler}>
      {children}
    </ModalLayout>
  );
}

export default memo(Modal);
