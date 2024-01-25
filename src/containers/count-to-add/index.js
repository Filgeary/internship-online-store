import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';

import useStore from '@src/hooks/use-store';
import useSelector from "@src/hooks/use-selector";
import modalsActions from '@src/store-redux/modals/actions';

import Modal from '@src/containers/modal';
import CountForm from '@src/components/count-form';

function CountToAdd() {
  const store = useStore();
  const dispatch = useDispatch();
  const select = useSelector((state) => ({
    activeItemBasket: state.basket.active,
  }));

  console.log('Basket active:', select.activeItemBasket);

  const callbacks = {
    onSubmit: (data) => {
      console.log(data);
      store.actions.basket.addToBasket(select.activeItemBasket, Number(data.count));
      dispatch(modalsActions.close());
    },

    closeModal: useCallback(() => {
      dispatch(modalsActions.close());
    }, [store]),
  };


  return (
    <Modal title="Введите количество">
      <CountForm onCancel={callbacks.closeModal} onSubmit={callbacks.onSubmit} />
    </Modal>
  );
}

export default CountToAdd;