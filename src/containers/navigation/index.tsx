import { memo, useCallback, useMemo } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/menu";
import BasketTool from "@src/components/basket-tool";
import SideLayout from "@src/components/side-layout";
import { useDispatch } from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import { useSelector as useSelectorRedux } from "react-redux";
import useInit from "@src/hooks/use-init";
import { useLocation } from "react-router-dom";

function Navigation() {
  const store = useStore();
  const location = useLocation();
  const dispatch = useDispatch();
  const activeModal = useSelectorRedux((state: any) => state.modals);
  const select = useSelector((state) => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang,
    active: state.basket.active,
  }));

  useInit(() => {
    if (typeof activeModal.data === "number") {
      store.actions.basket.addToBasket(select.active, activeModal.data);
      dispatch(modalsActions.reset());
    }
  }, [activeModal.data]);

  const callbacks = {
    // Открытие модалки корзины
    openModalBasket: useCallback(() => {
      //store.actions.modals.open('basket')
      dispatch(modalsActions.open("basket"));
    }, [store]),

    // Обработка перехода на главную
    onNavigate: useCallback(
      (item: any) => {
        if (item.key === 1) store.actions.catalog.resetParams();
      },
      [store]
    ),
  };

  // Функция для локализации текстов
  const { t } = useTranslate();

  const options = {
    menu: useMemo(
      () => [
        { key: 1, title: t("menu.main"), link: "/" },
        { key: 2, title: t("menu.chat"), link: "/chat" },
        { key: 3, title: t("menu.canvas"), link: "/canvas" },
      ],
      [t]
    ),
  };

  return (
    <SideLayout side="between">
      <Menu items={options.menu} onNavigate={callbacks.onNavigate} />
      {location.pathname === "/" && (
        <BasketTool
          onOpen={callbacks.openModalBasket}
          amount={select.amount}
          sum={select.sum}
          t={t}
        />
      )}
    </SideLayout>
  );
}

export default memo(Navigation);
