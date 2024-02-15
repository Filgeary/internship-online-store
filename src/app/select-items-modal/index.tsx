import {memo, useCallback, useMemo, useState} from 'react';
import useTranslate from "@src/hooks/use-translate";
import ModalLayout from "@src/components/modal-layout";
import PropTypes from "prop-types";
import CatalogFilter from '@src/containers/catalog-filter';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';
import CatalogListSelect from '@src/containers/catalog-list-select';
import useUnmount from '@src/hooks/use-unmount';
import { type SelectItemsModalProps } from './types';

function SelectItemsModal(props: SelectItemsModalProps) {

  const store = useStore();
  const {t, lang} = useTranslate();
  const [selectedItems, setSelectedItems] = useState<string[]>([])

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
    toggleSelect: useCallback((itemId: string) => {
      setSelectedItems(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId)
        } else {
          return [...prev, itemId]
        }
      })
    }, []),
  }

  const catalogModuleName = useMemo(() => store.makeModule('catalog', {
    urlEditing: false
  }), [])

  useInit(async () => {
    await Promise.all([
      store.actions[catalogModuleName].setParams(),
      store.actions.categories.load()
    ])
  }, [lang], true);

  useUnmount(() => store.deleteModule(catalogModuleName))

  return (
    <ModalLayout title={props.extraData?.getTitle() || t('select-items-modal.choose-items')} 
                 labelClose={t('basket.close')}
                 onClose={callbacks.cancelModal}
                 appendSubmit
                 labelSubmit={props.extraData?.getLabelSubmit() || t("select-items-modal.ok")}
                 submitDisabled={!selectedItems.length}
                 onSubmit={callbacks.submitModal}
                 background={props.background}>
        <CatalogFilter catalogModuleName={catalogModuleName}/>
        <CatalogListSelect selectedItems={selectedItems} 
                           toggleSelect={callbacks.toggleSelect}
                           catalogModuleName={catalogModuleName}/>
    </ModalLayout>
  );
}

SelectItemsModal.propTypes = {
  background: PropTypes.bool,
  id: PropTypes.number,
  extraData: PropTypes.shape({
    getTitle: PropTypes.func,
    getLabelSubmit: PropTypes.func
  })
};

SelectItemsModal.defaultProps = {
  background: false,
};

export default memo(SelectItemsModal);
