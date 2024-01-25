import PropTypes from 'prop-types';

import React, { useCallback, createContext } from 'react';
import { useDispatch } from 'react-redux';

import useStore from '@src/hooks/use-store';
import modalsActions from '@src/store-redux/modals/actions';

import ModalLayout from '@src/components/modal-layout';

function Modal({children, ...props}) {
  const store = useStore();
  const dispatch = useDispatch();

  const callbacks = {
    closeModal: useCallback(() => {
      dispatch(modalsActions.close());
    }, [store]),
  };

  return (
    <ModalLayout {...props} onClose={callbacks.closeModal}>
      {children}
    </ModalLayout>    
  );
}


Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  labelClose: PropTypes.string,
};

Modal.defaultProps = {
  title: 'Модалка',
  labelClose: 'Закрыть',
};

export default Modal;