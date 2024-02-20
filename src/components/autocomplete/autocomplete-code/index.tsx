import React from 'react';
import './style.css';
import { cn as bem } from '@bem-react/classname';

type AutocompleteCodeProps = {
  code: string;
  onClick?: (...args: any[]) => void;
  className?: string;
} & React.ComponentProps<'div'>;

function AutocompleteCode(props: AutocompleteCodeProps) {
  const { code, onClick, className } = props;

  const cn = bem('AutocompleteCode');

  return (
    <div {...props} className={`${cn()} ${className}`} onClick={onClick}>
      {code}
    </div>
  );
}

export default AutocompleteCode;
