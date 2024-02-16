import {memo, useCallback} from 'react';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import Controls from "@src/components/controls";
import {IArticle} from "../../../types/IArticle";

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
    itemBasket: useCallback((item: IArticle) => (
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

