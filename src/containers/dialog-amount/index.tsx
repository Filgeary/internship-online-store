import { memo, useState } from 'react';

import Input from '@src/components/input';
import ModalLayout from '@src/components/modal-layout';
import SideLayout from '@src/components/side-layout';
import useTranslate from '@src/hooks/use-translate';

type Props = {
  onClose: (amount: number) => void;
};

const DialogAmount = ({ onClose }: Props) => {
  const { t } = useTranslate();
  const [value, setValue] = useState('');

  const handleCloseModal = (amount: string | number) => {
    onClose(+amount);
  };

  return (
    <ModalLayout
      title={t('dialogAmount.title')}
      labelClose={t('dialog.close')}
      onClose={() => handleCloseModal(0)}
    >
      <div style={{ textAlign: 'center' }}>
        <Input
          type='number'
          name='amount'
          value={value}
          onChange={setValue}
          delay={0}
        />

        <SideLayout
          side='center'
          padding='medium'
        >
          <button onClick={() => handleCloseModal(0)}>{t('dialog.cancel')}</button>
          <button onClick={() => handleCloseModal(value)}>{t('dialog.confirm')}</button>
        </SideLayout>
      </div>
    </ModalLayout>
  );
};

export default memo(DialogAmount);
