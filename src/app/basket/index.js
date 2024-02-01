import {memo, useCallback} from 'react';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import ItemBasket from "@src/components/item-basket";
import List from "@src/components/list";
import ModalLayout from "@src/components/modal-layout";
import BasketTotal from "@src/components/basket-total";
import PropTypes from "prop-types";
import useModal from '@src/hooks/use-modal';
import BasketButton from '@src/components/basket-button';

function Basket(props) {

  const store = useStore();
  const modal =  useModal();
  const {t} = useTranslate();

  const select = useSelector(state => ({
    list: state.basket.list,
    amount: state.basket.amount,
    sum: state.basket.sum
  }));

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.actions.basket.removeFromBasket(_id), [store]),
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      modal.close(props.id);
    }, [store, props.id]),
    selectMoreItems: useCallback(() => new Promise((res) => modal.open({
        type: modal.types.selectItems,
        resolve: res,
        extraData: {
          title: 'Добавить товары в корзину',
          labelSubmit: 'Добавить'
        }
      })).then(ids => {
        if (ids?.length) {
          store.actions.basket.addManyToBasket(ids)
        }
      })
    )
  }

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
    <ModalLayout title={t('basket.title')} 
                 labelClose={t('basket.close')}
                 onClose={callbacks.closeModal}
                 background={props.background}>
      <List list={select.list} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t}/>
      <BasketButton onClick={callbacks.selectMoreItems}>Выбрать еще товар</BasketButton>
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
