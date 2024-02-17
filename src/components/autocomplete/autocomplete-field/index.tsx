import React, { memo } from 'react';
import './style.css';
import { cn as bem } from '@bem-react/classname';

type FieldProps = {
  isDisabled?: boolean;
  isActive?: boolean;
  onKeyDown?: () => void;
  onClick?: () => void;
  code?: string;
  title?: string;
};

function AutocompleteField(props: FieldProps, ref: React.RefObject<HTMLDivElement>) {
  const cn = bem('AutocompleteField');

  return (
    <div
      ref={ref}
      tabIndex={props.isDisabled ? -1 : 0}
      onKeyDown={props.onKeyDown}
      onClick={props.onClick}
      className={cn({ active: props.isActive, disabled: props.isDisabled })}
    >
      <div className={cn('code')}>{props.code}</div>
      <span className={cn('title')}>{props.title}</span>
    </div>
  );
}

export default memo(React.forwardRef(AutocompleteField));
