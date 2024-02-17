import './style.css';

import { memo, useEffect, useRef } from 'react';
import { cn as bem } from '@bem-react/classname';
import { TOption, useAutocomplete } from '..';

type OptionProps = {
  option: TOption;
  disabled?: boolean;
  isTitle?: boolean;
};

function Option(props: OptionProps) {
  const { option, disabled, isTitle } = props;
  const { values, helpers, callbacks, listRef } = useAutocomplete();

  const optionRef = useRef<HTMLDivElement>(null);

  const cn = bem('Option');

  const isActive = values.active._id === props.option._id && !isTitle;

  const handlers = {
    onClick: () => callbacks.setActive(option),
  };

  useEffect(() => {
    if (isActive && optionRef.current && listRef.current) {
      // При раскрытии - активный будет вверху и в фокусе
      optionRef.current.focus();
      listRef.current.scrollTo(0, optionRef.current.offsetTop - listRef.current.clientHeight / 2);
    }
  }, [isActive]);

  return (
    <div
      ref={optionRef}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={helpers.onSpaceDown(handlers.onClick)}
      onClick={handlers.onClick}
      className={cn({ active: isActive, disabled })}
    >
      <div className={cn('code')}>{option.code}</div>
      <span className={cn('title')}>{option.title}</span>
    </div>
  );
}

export default memo(Option);
