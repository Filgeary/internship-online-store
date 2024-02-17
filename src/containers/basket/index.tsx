import { memo, useCallback } from 'react';

import BasketTotal from '@src/components/basket-total';
import ItemBasket from '@src/components/item-basket';
import List from '@src/components/list';
import ModalLayout from '@src/components/modal-layout';
import SideLayout from '@src/components/side-layout';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

import type { IArticle } from '@src/types/IArticle';

interface IArticleItemBasket extends IArticle {
  amount: number;
}

type Props = {
  onClose: Function;
};

function Basket({ onClose }: Props) {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const callbacks = {
    removeFromBasket: useCallback(
      (_id: string | number) => store.actions.basket.removeFromBasket(String(_id)),
      [store],
    ),
    closeModal: useCallback(() => {
      onClose();
    }, [onClose]),
    addToBasket: useCallback(
      async (productIDs: string[]) => {
        if (!productIDs.length) return;

        for (const id of productIDs) {
          await store.actions.basket.addToBasket(id, 1);
        }
      },
      [store],
    ),
  };

  const openModalCatalog = useCallback(() => {
    store.actions.modals.open('modalCatalog', callbacks.addToBasket);
  }, [callbacks.addToBasket, store]);

  const renders = {
    itemBasket: useCallback(
      (item: IArticleItemBasket) => (
        <ItemBasket
          item={item}
          link={`/articles/${item._id}`}
          onRemove={callbacks.removeFromBasket}
          onLink={callbacks.closeModal}
          labelUnit={t('basket.unit')}
          labelDelete={t('basket.delete')}
        />
      ),
      [callbacks.closeModal, callbacks.removeFromBasket, t],
    ),
  };

  return (
    <ModalLayout
      title={t('basket.title')}
      labelClose={t('basket.close')}
      onClose={callbacks.closeModal}
    >
      <List
        list={select.list}
        renderItem={renders.itemBasket}
      />
      <BasketTotal
        sum={select.sum}
        t={t}
      />

      <SideLayout side='center'>
        <button onClick={openModalCatalog}>{t('basket.selectMoreProducts')}</button>
      </SideLayout>
    </ModalLayout>
  );
}

export default memo(Basket);
