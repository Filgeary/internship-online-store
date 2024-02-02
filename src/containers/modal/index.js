import PropTypes from 'prop-types';

import React, { useCallback, useRef, memo, useEffect, useState, useMemo } from 'react';

import useStore from '@src/hooks/use-store';

import ModalLayout from '@src/components/modal-layout';
import useOnClickOutside from '@src/hooks/use-on-click-outside';
import useSelector from '@src/hooks/use-selector';

const Modal = ({children, ...props}) => {
  const store = useStore();
  const uid = useSelector((state) => state.modals.lastOpened);
  const [modalId, setModalId] = useState(null);

  useEffect(() => {
    setModalId(modalId ?? uid);
  }, [modalId, uid]);

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
