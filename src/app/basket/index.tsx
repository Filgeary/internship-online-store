import { memo, useCallback } from 'react';
import useStore from '@src/hooks/use-store';
import useSelector from '@src/hooks/use-selector';
import useTranslate from '@src/hooks/use-translate';
import ItemBasket from '@src/components/item-basket';
import List from '@src/components/list';
import Modal from '@src/containers/modal';
import BasketTotal from '@src/components/basket-total';
import BasketFooter from '@src/components/basket-footer';
import Spinner from '@src/components/spinner';

function Basket() {
  const store = useStore();

  const select = useSelector((state: any) => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
    waiting: state.basket.waiting,
    dataObj: state.modals.dataObj,
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(
      (_id: string) => store.actions.basket.removeFromBasket(_id),
      [store]
    ),
    // Открыть модалку каталога
    openCatalogModal: useCallback(() => {
      const promiseOfModal = store.actions.modals.open('catalogModal');

      promiseOfModal
        .then((updatedItems: any) => {
          store.actions.basket.addMany(updatedItems);
        })
        .catch(() => {});
    }, [store]),
  };

  const { t } = useTranslate();

  const renders = {
    itemBasket: useCallback(
      (item: any) => (
        <ItemBasket
          item={item}
          link={`/articles/${item._id}`}
          onRemove={callbacks.removeFromBasket}
          labelUnit={t('basket.unit')}
          labelDelete={t('basket.delete')}
        />
      ),
      [callbacks.removeFromBasket, t]
    ),
  };

  // const openAnotherBasket = () => store.actions.modals.open('basket').catch(() => {});

  return (
    <Modal title={t('basket.title')} labelClose={t('basket.close')}>
      <Spinner active={select.waiting}>
        <List list={select.list} renderItem={renders.itemBasket} />
        <BasketTotal sum={select.sum} t={t} />
      </Spinner>

      <BasketFooter>
        <button onClick={callbacks.openCatalogModal}>
          {t('basket.catalogModalOpen')}
        </button>
        {/* <button onClick={openAnotherBasket}>
          Открыть ещё корзину
        </button> */}
      </BasketFooter>
    </Modal>
  );
}

export default memo(Basket);
