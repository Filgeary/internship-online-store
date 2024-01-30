import {memo, useCallback, useEffect} from 'react';
import {useDispatch, useStore as useStoreRedux, useSelector as useSelectorRedux} from 'react-redux';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import Modal from "@src/containers/modal";
import BasketTotal from "@src/components/basket-total";
import BasketFooter from '@src/components/basket-footer';

function Basket() {
  const store = useStore();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
    dataObj: state.modals.dataObj,
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.actions.basket.removeFromBasket(_id), [store]),
    // Открыть модалку каталога
    openCatalogModal: useCallback(() => {
      const promiseOfModal = store.actions.modals.open('catalogModal');

      promiseOfModal.then((updatedItems) => {
        store.actions.basket.addMany(updatedItems);
        store.actions.modals.resetDataObj();
      });
    }, [store]),
  };

  const {t} = useTranslate();

  const renders = {
    itemBasket: useCallback((item) => (
      <ItemBasket item={item}
                  link={`/articles/${item._id}`}
                  onRemove={callbacks.removeFromBasket}
                  onLink={callbacks.closeModal}
                  labelUnit={t('basket.unit')}
                  labelDelete={t('basket.delete')}
      />
    ), [callbacks.removeFromBasket, t]),
  };

  return (
    <Modal title={t('basket.title')} labelClose={t('basket.close')}>
      <List list={select.list} renderItem={renders.itemBasket} />
      <BasketTotal sum={select.sum} t={t} />

      <BasketFooter>
        <button onClick={callbacks.openCatalogModal}>Добавить ещё товары</button>
      </BasketFooter>
    </Modal>
  );
}

export default memo(Basket);
