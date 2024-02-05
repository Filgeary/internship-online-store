import {memo, useCallback, useRef} from 'react';
import {useDispatch, useStore as useStoreRedux} from 'react-redux';
import useInit from '@src/hooks/use-init';
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import modalsActions from '@src/store-redux/modals/actions';
import CatalogList from '@src/containers/catalog-list';
import { CatalogFilterForModal } from '@src/containers/hoc/with-catalog-filter'
import {useSelector as useSelectorRedux} from 'react-redux';
import closeId from '@src/utils/closeId';

function Goods() {

  const store = useStore()
  const dispatch = useDispatch()

  const stateModal = useSelectorRedux(state => state.modals.modals)
  const nameModal = useSelectorRedux(state => state.modals.name)

  const callbacks = {
    closeModal: useCallback(() => {
      // Закрытие модалки
      // dispatch(modalsActions.closeModal('goods'));
      dispatch(modalsActions.closeModal(closeId(stateModal, 'goods')));
      // Установлен статус "модалка закрыта" для дальнейшего добавления выбранных товаров
      dispatch(modalsActions.changeStatusCatalogModal(true));
      }, [store]),
  }

  useInit(() => {
      store.actions.catalog_modal.initParams()
  }, [], true);

  const {t} = useTranslate();

  return (
    <ModalLayout 
      title='' 
      labelClose={t('basket.close')}
      onClose={callbacks.closeModal}>
        <CatalogFilterForModal/>
        <CatalogList stateName='catalog_modal'/>
    </ModalLayout>
  );
}

export default memo(Goods);