import { memo, useCallback, useEffect, useState } from 'react';

import ModalLayout from '@src/components/modal-layout';
import SideLayout from '@src/components/side-layout';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import CatalogFilter from '../catalog-filter';
import CatalogList from '../catalog-list';

type Props = {
  onClose: (data: any) => void;
};

const ModalCatalog = ({ onClose }: Props) => {
  const store = useStore();
  const { t } = useTranslate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => await store.actions['catalog2'].initParams();
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Нет зависимостей - исполнится один раз

  const callbacks = {
    closeModal: useCallback((data: any) => onClose(data), [onClose]),
    handleSelectItem: useCallback(
      (id: string, isAdding: boolean) => {
        if (isAdding) {
          setSelectedItems(prevState => [...prevState, id]);
        } else {
          setSelectedItems(prevState => prevState.filter(item => item !== id));
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [selectedItems, setSelectedItems], // need watching for selectedItems
    ),
  };

  return (
    <ModalLayout
      title={t('modalCatalog.title')}
      labelClose={t('modal.close')}
      onClose={() => callbacks.closeModal([])}
    >
      <SideLayout
        side='end'
        padding='medium'
      >
        <span>
          {t('modalCatalog.selectedProducts')}: <strong>{selectedItems.length}</strong>
        </span>
        <button
          onClick={() => callbacks.closeModal(selectedItems)}
          disabled={selectedItems.length === 0}
        >
          {t('modalCatalog.addProducts')}
        </button>
      </SideLayout>

      <CatalogFilter catalogSliceName='catalog2' />
      <CatalogList
        catalogSliceName='catalog2'
        isSelectionMode={true}
        onSelectItem={callbacks.handleSelectItem}
        selectedItems={selectedItems}
      />
    </ModalLayout>
  );
};

export default memo(ModalCatalog);
