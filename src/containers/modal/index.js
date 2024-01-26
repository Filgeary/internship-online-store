import PropTypes from 'prop-types';

import React, { useCallback, useRef, memo } from 'react';
import { useDispatch } from 'react-redux';

import useStore from '@src/hooks/use-store';
import modalsActions from '@src/store-redux/modals/actions';

import ModalLayout from '@src/components/modal-layout';
import useOnClickOutside from '@src/hooks/use-on-click-outside';

const Modal = ({children, ...props}) => {
  const store = useStore();
  const dispatch = useDispatch();

  const modalRef = useRef(null);

  const callbacks = {
    closeModal: useCallback(() => {
      dispatch(modalsActions.close());
    }, [store]),
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