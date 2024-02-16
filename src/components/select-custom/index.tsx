import React, { memo, useMemo, useRef, useState } from 'react';

import './style.css';
import { cn as bem } from '@bem-react/classname';
import Arrow from '@src/assets/images/arrow.svg';
import useOnClickOutside from '@src/hooks/use-on-click-outside';
import debounce from 'lodash.debounce';

type SelectCustomProps = {
  defaultVal?: string;
  onSelected: (option: TOption) => void;
  displayStringForOption: (option: TOption) => string;
  options: Array<{ code: string; title: string }>;
};

type TOption = {
  code: string;
  title: string;
};

function SelectCustom({
  defaultVal,
  onSelected,
  displayStringForOption,
  options,
}: SelectCustomProps) {
  const cn = bem('SelectCustom');

  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<TOption>({ code: '', title: defaultVal });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const items = useMemo(() => {
    return options.filter((option) => {
      return [option.code, option.title].some((val) =>
        val.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    });
  }, [options, debouncedSearch]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Утилита для запуска функций по нажатию клавиши 'Space'
  const onSpaceClick = (...handlers: ((...args: any[]) => void)[]): React.KeyboardEventHandler => {
    const handler: React.KeyboardEventHandler = (e: React.KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlers.forEach((handler) => handler());
      }
    };

    return handler;
  };

  const callbacks = {
    setActive: (item: TOption) => {
      setActive(item);
      setIsOpen(false);

      onSelected(item);
    },

    setSearch: debounce((value: string) => {
      setDebouncedSearch(value);
    }, 400),

    toggleOpen: () => setIsOpen((prev) => !prev),

    close: () => setIsOpen(false),
  };

  useOnClickOutside(wrapperRef, callbacks.close);

  return (
    <div ref={wrapperRef} className={cn({ active: isOpen })}>
      <div
        onClick={callbacks.toggleOpen}
        onKeyDown={onSpaceClick(callbacks.toggleOpen)}
        tabIndex={0}
        aria-controls='drop-countries'
        aria-expanded={isOpen}
        className={cn('row')}
      >
        <div className={cn('inner')}>
          <Option disabled={true} code={active.code} title={active.title} />
          <div className={cn('marker')}>
            <img className={cn('marker-image')} src={Arrow} alt='' aria-hidden='true' />
          </div>
        </div>
      </div>

      {/* Выпадашка */}
      <div className={cn('drop')} id='drop-countries'>
        <div className={cn('drop-inner')}>
          <div className={cn('search')}>
            <input
              onChange={(e) => callbacks.setSearch(e.target.value)}
              className={cn('search-input')}
              type='text'
              placeholder='Поиск'
            />
          </div>

          <div className={cn('col')}>
            {items.map((option) => (
              <Option
                key={option.code}
                isActive={option.code === active.code}
                code={option.code}
                title={displayStringForOption(option)}
                onClick={() => callbacks.setActive(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type OptionProps = {
  code?: string;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

function Option({ code, title, isActive, onClick, disabled }: OptionProps) {
  const cn = bem('Option');

  return (
    <div onClick={onClick} className={cn({ active: isActive, disabled })}>
      <div className={cn('code')}>{code}</div>
      <span className={cn('title')}>{title}</span>
    </div>
  );
}

export default memo(SelectCustom);
