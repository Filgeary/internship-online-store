import { memo, useCallback, useMemo } from 'react';

import BasketTool from '@src/components/basket-tool';
import Menu from '@src/components/menu';
import SideLayout from '@src/components/side-layout';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

import type { TMenuItem } from '@src/components/menu';

function Navigation() {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector(state => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang,
  }));

  const callbacks = {
    openModalBasket: useCallback(() => {
      store.actions.modals.open('basket');
    }, [store]),

    // Обработка перехода на главную
    onNavigate: useCallback(
      (item: TMenuItem) => {
        if (item.key === 1) store.actions.catalog.resetParams();
      },
      [store],
    ),
  };

  const options = {
    menu: useMemo(
      () => [
        { key: 1, title: t('menu.main'), link: '/' },
        { key: 2, title: t('menu.chat'), link: '/chat' },
        { key: 3, title: t('menu.canvas'), link: '/canvas' },
        { key: 4, title: t('menu.worker'), link: '/worker' },
      ],
      [t],
    ),
  };

  return (
    <SideLayout side='between'>
      <Menu
        items={options.menu}
        onNavigate={callbacks.onNavigate}
      />
      <BasketTool
        onOpen={callbacks.openModalBasket}
        amount={select.amount}
        sum={select.sum}
        t={t}
      />
    </SideLayout>
  );
}

export default memo(Navigation);
