import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './style.css';
import { cn as bem } from '@bem-react/classname';
import Arrow from '@src/assets/images/arrow.svg';
import useOnClickOutside from '@src/hooks/use-on-click-outside';
import debounce from 'lodash.debounce';

type SelectCustomProps = {
  placeholder?: string;
  onSelected: (option: TOption) => void;
  displayStringForOption: (option: TOption) => string;
  optionsBuilder: (search: string) => TOption[];
  options: Array<TOption>;
  value: string;
};

type TOption = {
  _id: string;
  code: string;
  title: string;
};

function SelectCustom(props: SelectCustomProps) {
  const { placeholder, onSelected, displayStringForOption, optionsBuilder, options, value } = props;

  const cn = bem('SelectCustom');
  const uid = useMemo(() => window.crypto.randomUUID(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debounceFn = useCallback(
    debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );

  const active = useMemo<TOption>(() => {
    return (
      options.find((option) => option._id === value) ?? { _id: '', code: '', title: placeholder }
    );
  }, [value, options, placeholder]);
  const items = useMemo(() => optionsBuilder(debouncedSearch), [optionsBuilder, debouncedSearch]);

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
      onSelected(item);
      setIsOpen(false);
    },

    setSearch: (value: string) => {
      setSearch(value);
      debounceFn(value);
    },

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
        aria-controls={uid}
        aria-expanded={isOpen}
        className={cn('row')}
      >
        <div className={cn('inner')}>
          <Option disabled={true} code={active.code} title={active.title || placeholder} />
          <div className={cn('marker')}>
            <img className={cn('marker-image')} src={Arrow} alt='' aria-hidden='true' />
          </div>
        </div>
      </div>

      {/* Выпадашка */}
      <div className={cn('drop')} id={uid}>
        <div className={cn('drop-inner')}>
          <div className={cn('search')}>
            <input
              value={search}
              onChange={(e) => callbacks.setSearch(e.target.value)}
              className={cn('search-input')}
              type='text'
              placeholder='Поиск'
            />
          </div>

          <div className={cn('col')}>
            {items.map((option) => (
              <Option
                key={option._id}
                isActive={option.code === active.code}
                code={option.code}
                title={displayStringForOption(option)}
                onClick={() => callbacks.setActive(option)}
                onKeyDown={onSpaceClick(() => callbacks.setActive(option))}
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

export default memo(SelectCustom);
