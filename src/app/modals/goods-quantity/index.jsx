import {memo, useCallback, useRef} from 'react';
import {useDispatch, useStore as useStoreRedux} from 'react-redux';
import {useSelector as useSelectorRedux} from 'react-redux';
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import modalsActions from '@src/store-redux/modals/actions';
import GoodsQuantityLayout from '@src/components/goods-quantity-layout';
import Input from '@src/components/input'
import closeId from '@src/utils/closeId';

function GoodsQuantity() {

  const store = useStore();
  const dispatch = useDispatch();
  const quantityGoodsRef = useRef(null)

  const stateModal = useSelectorRedux(state => state.modals.modals)

  const callbacks = {
    handleCancel: useCallback(() => {
      // dispatch(modalsActions.closeModal('quantity'))
      dispatch(modalsActions.closeModal(closeId(stateModal, 'quantity')))
    }, [store]),
    handleAdd: useCallback(() => {
        store.actions.basket.updateQuantityProduct(Number(quantityGoodsRef.current))
        //  dispatch(modalsActions.closeModal('quantity'))
        dispatch(modalsActions.closeModal(closeId(stateModal, 'quantity')))
    }, [store]),
    onChange: useCallback((value) => {
        quantityGoodsRef.current = value
    }, [store])
  }

  const {t} = useTranslate();

  return (
    <ModalLayout 
      title='' 
      labelClose={t('basket.close')}
      onClose={callbacks.closeModal}
      hideButton={false}>
        <GoodsQuantityLayout handleCancelClick={callbacks.handleCancel} handleAddClick={callbacks.handleAdd}>
          <Input
            value=''
            name='quantity'
            type='number'
            placeholder=''
            onChange={callbacks.onChange}
            theme=''/>
        </GoodsQuantityLayout>
    </ModalLayout>
  );
}

export default memo(GoodsQuantity);