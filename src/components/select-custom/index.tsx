import React, { memo, useCallback, useMemo, useRef, useState } from 'react';

import './style.css';
import { cn as bem } from '@bem-react/classname';
import Arrow from '@src/assets/images/arrow.svg';
import useOnClickOutside from '@src/hooks/use-on-click-outside';
import debounce from 'lodash.debounce';

import 'overlayscrollbars/overlayscrollbars.css';
// import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { Scrollbar } from 'react-scrollbars-custom';
import Option from './option';

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
      options.find((option) => option._id === value) ??
      options[0] ?? { _id: '', code: '', title: '' }
    );
  }, [value, options, placeholder]);
  const items = useMemo(() => optionsBuilder(debouncedSearch), [optionsBuilder, debouncedSearch]);
  // const items = options;

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
          <Option disabled={true} code={active.code} title={active.title} />
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

          <Scrollbar
            className={cn('col')}
            translateContentSizeYToHolder
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className={cn('col-thumb')} />;
              },
            }}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className={cn('col-track')} />;
              },
            }}
            wrapperProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className={cn('col-wrapper')} />;
              },
            }}
            contentProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className={cn('col-content')} />;
              },
            }}
          >
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
          </Scrollbar>
        </div>
      </div>
    </div>
  );
}

export default memo(SelectCustom);
