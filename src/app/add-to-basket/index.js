import React, {useCallback, useState} from 'react';
import ModalLayout from "@src/components/modal-layout";
import useStore from "@src/hooks/use-store";
import {useDispatch} from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import Input from "@src/components/input";
import InputNumber from "@src/components/input-number";

//Модальное окно для добавления товара в корзину, главное задание
function AddToBasket(props) {
  const store = useStore();
  const dispatch = useDispatch();

  const [value, setValue] = useState('')

  const callback = {
    closeModal: useCallback(() => {
      //store.actions.modals.close();
      dispatch(modalsActions.close());
    }, [store]),
  }

  return (
    <ModalLayout title={'Добавьте товар'} labelClose={'Закрыть'}
      onClose={callback.closeModal}>
      <InputNumber name={'addingItem'} type={'number'} value={'1'}
        min={0} max={100}
        placeholder={'Введите количество товара (от 1 до 10)'}/>
    </ModalLayout>
  );
}

export default AddToBasket;
