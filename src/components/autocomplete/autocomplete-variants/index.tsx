import { memo, useContext } from 'react';
import './style.css';

import { AutocompleteContext } from '..';
import { cn as bem } from '@bem-react/classname';
import AutocompleteCode from '../autocomplete-code';
import sliceLongString from '@src/utils/slice-long-string';

function AutocompleteVariants() {
  const { values, helpers } = useContext(AutocompleteContext);

  const cn = bem('AutocompleteVariants');

  return (
    <div className={cn()}>
      {Array.isArray(values.active) &&
        values.active.map((option, index) => (
          <div key={option?._id ?? index} className={cn('variant')}>
            <AutocompleteCode
              code={option?.code}
              onClick={(e) => helpers.deleteByCodeClick(e, option)}
              className={cn('code-action')}
              title={option?.title && sliceLongString(option.title)}
            />
          </div>
        ))}
    </div>
  );
}

export default memo(AutocompleteVariants);
