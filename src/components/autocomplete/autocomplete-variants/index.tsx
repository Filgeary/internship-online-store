import { memo, useContext, useEffect } from 'react';
import './style.css';

import { AutocompleteContext } from '..';
import { cn as bem } from '@bem-react/classname';
import sliceLongString from '@src/utils/slice-long-string';
import { TOption } from '../types';
import AutocompleteVariant from '../autocomplete-variant';

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
