import React, { useCallback, useRef, memo } from 'react';
import PropTypes from 'prop-types';

import useStore from '@src/hooks/use-store';
import useOnClickOutside from '@src/hooks/use-on-click-outside';
import useModalId from '@src/hooks/use-modal-id';

import ModalLayout from '@src/components/modal-layout';

const Modal = ({children, ...props}) => {
  const store = useStore();

  const modalId = useModalId();
  const modalRef = useRef(null);

  const callbacks = {
    closeModal: useCallback(() => {
      store.actions.modals.closeById(modalId);
    }, [store, modalId]),
  };

  const closeHandler = props.onClose || callbacks.closeModal;

  useOnClickOutside(modalRef, closeHandler);

  return (
    <ModalLayout
      {...props}
      ref={modalRef}
      onClose={closeHandler}
    >
      {children}
    </ModalLayout>    
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  labelClose: PropTypes.string,
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  title: 'Модалка',
  labelClose: 'Закрыть',
};

export default memo(Modal);
