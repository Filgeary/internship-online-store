import './style.css';

import React, { memo, useEffect, useRef } from 'react';
import { TOption } from '../types';

import { cn as bem } from '@bem-react/classname';
import AutocompleteCode from '../autocomplete-code';
import { useAutocompleteContext } from '..';

type AutocompleteVariantProps = {
  setRefOnFirstOpt: (el: HTMLDivElement) => void;
  onKeyDown: (option: TOption) => void;
  onClick: (option: TOption) => void;
  option: TOption;
  title: string;
};

function AutocompleteVariant(props: AutocompleteVariantProps) {
  const cn = bem('AutocompleteVariant');

  const { firstActiveOptionRef } = useAutocompleteContext();

  const innerRef = useRef<HTMLDivElement | null>(null);

  const handlers = {
    click: (e: React.MouseEvent) => {
      e.stopPropagation();
      props.onClick(props.option);
    },

    keyDown: (e: React.KeyboardEvent) => {
      if (e.code === 'Enter') {
        props.onKeyDown(props.option);
      }
    },
  };

  useEffect(() => {
    return () => {
      if (innerRef.current === firstActiveOptionRef.current) {
        firstActiveOptionRef.current = innerRef.current.nextElementSibling as HTMLDivElement;
      }

      const prevElem = innerRef.current.previousElementSibling as HTMLDivElement;
      const nextElem = innerRef.current.nextElementSibling as HTMLDivElement;

      if (prevElem) prevElem?.focus();
      else if (nextElem) nextElem?.focus();
    };
  }, []);

  return (
    <div
      ref={(el) => {
        props.setRefOnFirstOpt(el);
        innerRef.current = el;
      }}
      tabIndex={0}
      onKeyDown={handlers.keyDown}
      className={cn()}
    >
      <AutocompleteCode
        code={props.option?.code}
        onClick={handlers.click}
        className={cn('code-action')}
        title={props.title}
      />
    </div>
  );
}

export default memo(AutocompleteVariant);
