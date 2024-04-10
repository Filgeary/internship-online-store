import React, { memo } from 'react';

import { Button, Modal } from 'antd';

type TProps = {
  title: string;
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
  isBtnsDisabled?: boolean;
  children: React.ReactNode;
};

function EditModal(props: TProps) {
  const { children, title, isOpen, isBtnsDisabled = false, onCancel, onOk } = props;

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button disabled={isBtnsDisabled} key='cancel' type='default'>
          Отмена
        </Button>,

        <Button disabled={isBtnsDisabled} key='submit' type='primary' onClick={onOk}>
          Изменить
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
}

export default memo(EditModal);
