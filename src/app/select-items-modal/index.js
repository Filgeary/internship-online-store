import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import PropTypes from "prop-types";
import CatalogFilter from '@src/containers/catalog-filter';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';
import CatalogListSelect from '@src/containers/catalog-list-select';
import useUnmount from '@src/hooks/use-unmount';

function SelectItemsModal(props) {

  const store = useStore();
  const {t} = useTranslate();
  const [selectedItems, setSelectedItems] = useState([])

  const callbacks = {
    // Закрытие модалки
    cancelModal: useCallback(() => {
      store.actions.modals.close(props.id);
    }, [store, props.id]),

    // Закрытие модалки с передачей массива id выбранных товаров
    submitModal: useCallback(() => {
      store.actions.modals.close(props.id, selectedItems);
    }, [store, props.id, selectedItems]),

    // Убрать/добавить выделение товара
    toggleSelect: useCallback((itemId) => {
      setSelectedItems(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId)
        } else {
          return [...prev, itemId]
        }
      })
    }, []),
  }

  const catalogSliceName = useMemo(() => store.makeSlice('catalog'), [])

  useInit(async () => {
    await Promise.all([
      store.actions[catalogSliceName].initParams(),
      store.actions.categories.load()
    ]);
  }, [], true);

  useUnmount(() => store.deleteSlice(catalogSliceName))

  return (
    <ModalLayout title={props.extraData.title || 'Выбрать товар'} 
                 labelClose={t('basket.close')}
                 onClose={callbacks.cancelModal}
                 appendSubmit
                 labelSubmit={props.extraData.labelSubmit || 'Ок'}
                 submitDisabled={!selectedItems.length}
                 onSubmit={callbacks.submitModal}
                 background={props.background}>
        <CatalogFilter catalogSliceName={catalogSliceName}/>
        <CatalogListSelect selectedItems={selectedItems} 
                           toggleSelect={callbacks.toggleSelect}
                           catalogSliceName={catalogSliceName}/>
    </ModalLayout>
  );
}

SelectItemsModal.propTypes = {
  background: PropTypes.bool,
  id: PropTypes.number,
  extraData: PropTypes.shape({
    title: PropTypes.string,
    labelSubmit: PropTypes.string
  })
};

SelectItemsModal.defaultProps = {
  background: false,
  extraData: {
    title: 'Выбрать товар',
    labelSubmit: 'Ок'
  }
};

export default memo(SelectItemsModal);
