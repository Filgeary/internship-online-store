import './style.css';
import { memo, useContext, useEffect, useState } from 'react';
import { cn as bem } from '@bem-react/classname';

import { AutocompleteContext } from '..';
import AutocompleteVariant from '../autocomplete-variant';

import sliceLongString from '@src/utils/slice-long-string';
import { TOption } from '../types';

function AutocompleteVariants() {
  const { values, helpers, firstActiveOptionRef, firstOptionRef } = useContext(AutocompleteContext);

  const cn = bem('AutocompleteVariants');

  const setRefOnFirstOpt = (el: HTMLDivElement) => {
    firstActiveOptionRef.current ??= el;
  };

  const handlers = {
    click: (option: TOption) => {
      helpers.deleteOption(option);
    },

    keyDown: (option: TOption) => {
      helpers.deleteOption(option);
    },
  };

  useEffect(() => {
    return () => {
      firstActiveOptionRef.current = null;
      firstOptionRef.current.focus();
    };
  }, []);

  return (
    <div className={cn()}>
      {Array.isArray(values.active) &&
        values.active.map((option, index) => (
          <AutocompleteVariant
            title={option?.title && sliceLongString(option.title)}
            onClick={handlers.click}
            onKeyDown={handlers.keyDown}
            key={option?._id ?? index}
            option={option}
            setRefOnFirstOpt={setRefOnFirstOpt}
          />
        ))}
    </div>
  );
}

export default memo(AutocompleteVariants);
