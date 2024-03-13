import React, {memo, useCallback, useMemo} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/menu";
import BasketTool from "@src/components/basket-tool";
import SideLayout from "@src/components/side-layout";

function Navigation() {
  const store = useStore();

  const select = useSelector(state => ({
    modalsList: state.modals.modalsList,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const callbacks =  {
    // Открытие модалки корзины
    openModalBasket: useCallback(async () => {
      const result = await store.actions.modals.open('basket')
    }, [store]),

    // Обработка перехода на главную
    onNavigate: useCallback((item: any) => {
      if (item.key === 1) store.actions.catalog.resetParams();
    }, [store])
  }


  // Функция для локализации текстов
  const {t}: any = useTranslate();

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
      {key: 2, title: t('menu.chat'), link: '/chat'},
      {key: 3, title: t('menu.canvas'), link: '/canvas'},
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
