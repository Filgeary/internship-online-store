import {memo, useCallback} from 'react';
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import PropTypes from "prop-types";
import useModal from '@src/hooks/use-modal';
import CatalogFilter from '@src/containers/catalog-filter';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';
import withLocalStoreInServices from '@src/hocs/with-local-store-in-services';
import CatalogList from '@src/containers/catalog-list';
import Main from '../main';

function PageModal(props) {

  const modal =  useModal()
  const store = useStore();
  const {t} = useTranslate();

  const callbacks = {
    // Закрытие модалки
    cancelModal: useCallback(() => {
      modal.close(props.id);
    }, [modal, props.id]),
  }

  useInit(async () => {
    await Promise.all([
      store.actions.catalog.initParams(),
      store.actions.categories.load()
    ]);
  }, [], true);

  return (
    <ModalLayout title={props.extraData.title || 'Страница'} 
                 labelClose={t('basket.close')}
                 onClose={callbacks.cancelModal}
                 background={props.background}>
        <Main/>
    </ModalLayout>
  );
}

PageModal.propTypes = {
  background: PropTypes.bool,
  id: PropTypes.number,
  extraData: PropTypes.shape({
    title: PropTypes.string,
  })
};

PageModal.defaultProps = {
  background: false,
  extraData: {
    title: 'Страница',
  }
};

export default memo(withLocalStoreInServices(PageModal, ['catalog', 'basket', 'categories']));
