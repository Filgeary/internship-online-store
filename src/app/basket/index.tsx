import {memo, useCallback} from 'react';
import useStore from "../../hooks/use-store";
import useSelector from "../../hooks/use-selector";
import useTranslate from "../../hooks/use-translate";
import ItemBasket from "../../components/item-basket";
import List from "../../components/list";
import BasketTotal from "../../components/basket-total";
import Button from '../../components/button';
import { BasketPropsType } from './types';
import { BasketItemType } from '../../store/basket/types';
import ModalLayout from '../../components/modal-layout';

function Basket({close}: BasketPropsType) {

  const store = useStore();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback((_id: string) => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => close(), [store]),
    // открытие каталога в модалке
    catalogOpen: useCallback(() => {
      store.actions.modals.open('catalogModal')
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
    itemBasket: useCallback((item: BasketItemType) => (
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
