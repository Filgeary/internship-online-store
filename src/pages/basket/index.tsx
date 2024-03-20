import React, {memo, useCallback} from 'react';
import useStore from "@src/shared/hooks/use-store";
import useSelector from "@src/shared/hooks/use-selector";
import useTranslate from "@src/shared/hooks/use-translate";
import ItemBasket from "@src/pages/basket/components/item-basket";
import ModalLayout from "@src/shared/ui/layout/modal-layout";
import List from "@src/shared/ui/elements/list";
import BasketTotal from "@src/pages/basket/components/basket-total";
import Controls from "@src/shared/ui/elements/controls";

function Basket({onClose}: {onClose: (value?: any) => void}) {

  const store = useStore();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback((_id: string | number) => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      onClose()
    }, [store]),
    openModalList: useCallback(async () => {
      const result = await store.actions.modals.open('modalList') as Record<string, number>
      if(Object.keys(result).length > 0) await store.actions.basket.addListArticle(result)
    }, [store])
  }

  const {t} = useTranslate();

  const renders = {
    itemBasket: useCallback((item: any) => (
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
      <Controls title={t('basket.add')} onAdd={callbacks.openModalList}/>
    </ModalLayout>
  );
}

export default memo(Basket);

