import React, { memo } from 'react';

import { Button, Modal } from 'antd';

type TProps = {
  title: string;
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
  isBtnsDisabled?: boolean;
  isSubmitDisabled?: boolean;
  submitText?: string;
  children: React.ReactNode;
};

function EditModal(props: TProps) {
  const {
    children,
    title,
    isOpen,
    isBtnsDisabled = false,
    isSubmitDisabled = false,
    onCancel,
    onOk,
    submitText = 'Изменить',
  } = props;

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button disabled={isBtnsDisabled} key='cancel' type='default' onClick={onCancel}>
          Отмена
        </Button>,

        <Button
          disabled={isBtnsDisabled || isSubmitDisabled}
          key='submit'
          type='primary'
          onClick={onOk}
        >
          {submitText}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
}

export default memo(EditModal);
