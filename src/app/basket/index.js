import {memo, useCallback} from 'react';
import {useDispatch, useStore as useStoreRedux} from 'react-redux';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useInit from "@src/hooks/use-init";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import Button from '@src/components/button';

function Basket({close}) {

  const store = useStore();
  const dispatch = useDispatch();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => close(), [store]),
    // открытие каталога в модалке
    catalogOpen: useCallback(() => {
      store.actions.modals.open("catalogModal")
        .then(async result =>  {
          if(result) {
            for(const item of result) {
              await store.actions.basket.addToBasket(item);
            }
          }
        })
    }, [store])
  }

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
    <ModalLayout title={t('basket.title')} labelClose={t('basket.close')}
                 onClose={callbacks.closeModal}>
      <List list={select.list} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t}/>
      <Button title={t('button.addMore')} onClick={callbacks.catalogOpen}/>
    </ModalLayout>
  );
}

export default memo(Basket);
