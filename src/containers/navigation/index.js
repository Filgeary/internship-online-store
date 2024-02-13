import {memo, useCallback, useMemo} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/menu";
import BasketTool from "@src/components/basket-tool";
import SideLayout from "@src/components/side-layout";
import {useDispatch} from 'react-redux';
import modalsActions from '@src/store-redux/modals/actions';
import codeGenerator from "@src/utils/code-generator";
import generateUniqueId from "@src/utils/unicque_id"

function Navigation() {
  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang
  }));

  const id = generateUniqueId()

  const callbacks = {
    // Открытие модалки корзины
    openModalBasket: useCallback(() => {
      //store.actions.modals.open('basket')
      // dispatch(modalsActions.open('basket'))
      dispatch(modalsActions.open({name: 'basket', id: id}))
      dispatch(modalsActions.changeActiveModal(true))
    }, [store]),

    // Обработка перехода на главную
    onNavigate: useCallback((item) => {
      if (item.key === 1) store.actions.catalog.resetParams();
    }, [store])
  }

  // Функция для локализации текстов
  const {t} = useTranslate();

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
    ]), [t])
  };

  return (
    <SideLayout side='between'>
      <Menu items={options.menu} onNavigate={callbacks.onNavigate}/>
      <BasketTool onOpen={callbacks.openModalBasket} amount={select.amount} sum={select.sum} t={t}/>
    </SideLayout>
  );
}

export default memo(Navigation);
