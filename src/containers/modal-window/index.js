import React, {memo, useCallback, useMemo} from 'react';
import ModalLayout from "@src/components/modal-layout";
import Basket from "src/app/basket";
import ModalAddBasket from "@src/components/modal-add-basket";
import modalsActions from "@src/store-redux/modals/actions";
import articleActions from "@src/store-redux/article/actions";
import {useDispatch} from "react-redux";
import useTranslate from "@src/hooks/use-translate";
import {useSelector as useSelectorRedux} from "react-redux/es/hooks/useSelector";

// Вопрос по поводу модальных окон, исходя из задания я подумал что модалка с добавлением товара,
// должна быть "глупым" компонентом так как не выполняет действия отправки сама,
// но при этом сама корзина является "умным" компонентом
// так вот, у меня есть отдельное решение для корзины в качестве глупого компонента,
// поэтому я добавил данные у модального окна, чтобы можно было сделать его глупым компонентом
function ModalWindow() {
  const dispatch = useDispatch()

  const {t} = useTranslate();

  const selectRedux = useSelectorRedux(state => state.modals);

  // Так как на отдельное модальное окно возращаются новые данные то результат необходимо мемоизировать, каждый раз при вычислении возращается новый обьект даты
  const memoizedSelectRedux = useMemo(() => ({
    modalName: selectRedux.name,
    modalData: selectRedux.data
  }), [selectRedux.name, selectRedux.data]);


  const callbacks = {
    // Закрытие модалки
    onClose: useCallback(() => {
      dispatch(modalsActions.close())
    }, []),
  }

  return (
    <>
      {memoizedSelectRedux.modalName === 'basket' &&
        <Basket data={memoizedSelectRedux.modalData} onClose={callbacks.onClose} t={t}/>}
      {memoizedSelectRedux.modalName === 'adding' &&
        <ModalAddBasket data={memoizedSelectRedux.modalData} onClose={callbacks.onClose} t={t}/>}
    </>
  );
}

export default memo(ModalWindow);
