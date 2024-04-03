import { cn as bem } from '@bem-react/classname';
import * as React from 'react';
import { memo } from 'react';

import './style.css';

type Props = {
  label?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
};

function Field({ label, error, children }: Props) {
  const cn = bem('Field');

  return (
    <div className={cn()}>
      <label className={cn('label')}>{label}</label>
      <div className={cn('input')}>{children}</div>
      <div className={cn('error')}>{error}</div>
    </div>
  );
}

export default memo(Field);
