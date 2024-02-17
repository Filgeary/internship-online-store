import './style.css';

import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';

type OptionProps = {
  code?: string;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  onKeyDown?: (...args: any[]) => void;
  disabled?: boolean;
};

function Option(props: OptionProps) {
  const { code, title, isActive, onClick, onKeyDown, disabled } = props;

  const cn = bem('Option');

  return (
    <div
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      onClick={onClick}
      className={cn({ active: isActive, disabled })}
    >
      <div className={cn('code')}>{code}</div>
      <span className={cn('title')}>{title}</span>
    </div>
  );
}

export default memo(Option);
