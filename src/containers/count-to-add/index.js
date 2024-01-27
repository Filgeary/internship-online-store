import React, { useCallback, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import useStore from '@src/hooks/use-store';
import useSelector from "@src/hooks/use-selector";
import modalsActions from '@src/store-redux/modals/actions';

import Modal from '@src/containers/modal';
import CountForm from '@src/components/count-form';

import useTranslate from '@src/hooks/use-translate';

import preBasketActions from '@src/store-redux/pre-basket/actions';

function CountToAdd() {
  const store = useStore();
  const dispatch = useDispatch();
  const select = useSelector((state) => ({
    activeItemBasket: state.basket.active,
  }));

  const [isSuccess, setIsSuccess] = useState(false);
  const {t} = useTranslate();

  const callbacks = {
    onSubmit: (data) => {
      // store.actions.basket.addToBasket(select.activeItemBasket._id, Number(data.count));
      store.actions.basket.setCountToAdd(Number(data.count));
      // dispatch(preBasketActions.setCountToAdd(Number(data.count)));
      setIsSuccess(true);
      // dispatch(modalsActions.close());
    },

    closeModal: useCallback((willBeAdd = isSuccess) => {
      // Альтернатива эффекту в app/main
      // if (willBeAdd) {
        // store.actions.basket.addToBasket(
        //   select.activeItemBasket._id,
        //   select.activeItemBasket.countToAdd,
        // );
      // }

      // Был вариант с добавлением bool-значения и проверкой значения
      // В самом эффекте app/main и последующим вызовом функции
      // dispatch(modalsActions.close({ willBeAdd })); 

      const addToBasket = () => {
        store.actions.basket.addToBasket(
          select.activeItemBasket._id,
          select.activeItemBasket.countToAdd,
          // selectRedux.activeItemBasket.countToAdd
        );
      };

      const catalogFn = willBeAdd ? addToBasket : null;

      if (!willBeAdd) {
        store.actions.basket.resetActive();
      }
      
      dispatch(modalsActions.close({ catalogFn }));
    }, [store, isSuccess]),

    cancel() {
      setIsSuccess(false);
      callbacks.closeModal(false);
    },
  };

  const renders = {
    successText: (count) => t('countModal.success').replace(/\[:count:\]/gi, count), 
  };

  return (
    <Modal
      onClose={callbacks.closeModal}
      title={t('countModal.title')}
      labelClose={t('countModal.close')}
    >
      <CountForm
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
        onCancel={() => callbacks.cancel()}
        onSubmit={callbacks.onSubmit}
        labelOfInput={t('countModal.countInput')}
        labelOfCancel={t('countModal.cancel')}
        labelOfOk={t('countModal.ok')}
        successText={renders.successText}
        initialFocus={true}
      />
    </Modal>
  );
}

export default CountToAdd;