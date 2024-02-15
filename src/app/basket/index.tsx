import {memo, useCallback} from 'react';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import PropTypes from "prop-types";
import BasketButton from '@src/components/basket-button';
import useInit from '@src/hooks/use-init';
import type { BasketProps } from './types';
import type { BasketItem } from '@src/types';

function Basket(props: BasketProps) {

  const store = useStore();
  const {t, lang} = useTranslate();
  
  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  useInit(async () => {
    await Promise.all([
      store.actions.basket.translateItems(),
    ]);
  }, [lang], true);

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback((_id: string) => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      store.actions.modals.close(props.id);
    }, [store, props.id]),
    selectMoreItems: useCallback(() => new Promise<string[] | undefined>(
      (res) => store.actions.modals.open({
        type: store.actions.modals.types.selectItems,
        resolve: res,
        extraData: {
          getTitle: () => t('select-items-modal.add-items-in-basket'),
          getLabelSubmit: () => t('select-items-modal.add')
        }})
      ).then((ids) => {
        if (ids?.length) {
          store.actions.basket.addManyToBasket(ids)
        }
      }), [store])
  }

  const renders = {
    itemBasket: useCallback((item: BasketItem) => (
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
    <ModalLayout title={t('basket.title')} 
                 labelClose={t('basket.close')}
                 onClose={callbacks.closeModal}
                 background={props.background}>
      <List list={select.list} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t}/>
      <BasketButton onClick={callbacks.selectMoreItems}>
        {t('basket.select-more-items')}
      </BasketButton>
    </ModalLayout>
  );
}

Basket.propTypes = {
  background: PropTypes.bool,
  id: PropTypes.number
};

Basket.defaultProps = {
  background: false
};

export default memo(Basket);
