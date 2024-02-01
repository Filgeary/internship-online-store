import {memo, useCallback, useRef} from 'react';
import {useDispatch, useStore as useStoreRedux} from 'react-redux';
import useInit from '@src/hooks/use-init';
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import modalsActions from '@src/store-redux/modals/actions';
import CatalogListModal from '@src/containers/catalog-list-modal';
//import CatalogFilterForModal from '@src/containers/catalog-filter-for-modal';
import { CatalogFilterForModal } from '@src/containers/hoc/with-catalog-filter';

function Goods() {

  const store = useStore();
  const dispatch = useDispatch();

  const callbacks = {
    closeModal: useCallback(() => {
      // Закрытие модалки
      dispatch(modalsActions.closeModal('goods'));
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
        {/* <CatalogFilterForModal/> */}
        <CatalogFilterForModal/>
        <CatalogListModal/>
    </ModalLayout>
  );
}

export default memo(Goods);