import { useCallback, useState, memo } from 'react';

import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

import Modal from '@src/containers/modal';
import CountForm from '@src/components/count-form';

function CountToAdd() {
  const store = useStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslate();

  const callbacks = {
    onSubmit: useCallback(
      (data: { count: any }) => {
        store.actions.basket.setCountToAdd(Number(data.count));
        setIsSuccess(true);
      },
      [store]
    ),

    closeModal: useCallback(
      (willBeAdd = isSuccess) => {
        if (willBeAdd) {
          store.actions.modals.close();
        } else {
          store.actions.modals.closeRej();
        }
      },
      [store, isSuccess]
    ),

    cancel: useCallback(() => {
      setIsSuccess(false);
      callbacks.closeModal(false);
    }, []),
  };

  const renders = {
    successText: (count: any) =>
      t('countModal.success').replace(/\[:count:\]/gi, count),
  };

  return (
    <Modal
      onClose={callbacks.closeModal}
      title={t('countModal.title')}
      labelClose={t('countModal.close')}
    >
      <CountForm
        isSuccess={isSuccess}
        setIsSuccess={setIsSuccess}
        onCancel={() => callbacks.cancel()}
        onSubmit={callbacks.onSubmit}
        labelOfInput={t('countModal.countInput')}
        labelOfCancel={t('countModal.cancel')}
        labelOfOk={t('countModal.ok')}
        successText={renders.successText}
        initialFocus={true}
      />
    </Modal>
  );
}

export default memo(CountToAdd);
