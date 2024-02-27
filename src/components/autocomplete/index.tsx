import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Arrow from '@src/assets/images/arrow.svg';

import './style.css';
import { cn as bem } from '@bem-react/classname';
import { Scrollbar } from 'react-scrollbars-custom';

import useOnClickOutside from '@src/hooks/use-on-click-outside';

import AutocompleteOption from './autocomplete-option';
import AutocompleteSearch from './autocomplete-search';
import AutocompleteList from './autocomplete-list';

import simplifyName from '@src/utils/simplify-name';
import sliceLongString from '@src/utils/slice-long-string';

import AutocompleteField from './autocomplete-field';
import AutocompleteVariants from './autocomplete-variants';

import { TAutocompleteContext, TOption } from './types';

type AutocompleteProps = {
  children: React.ReactNode;
  placeholder?: string;
  options: Array<TOption>;
  value: string | string[];
  onSelected?: (option: TOption) => void;
  onOpen?: () => void;
  onClose?: (ids: string[]) => void;
  smooth?: boolean;
  onFirstDropAll?: boolean;
  disabled?: boolean;
  isMultiple?: boolean;
  max?: number;
  showActiveCodes?: boolean;
  onRemoveCodes?: (ids: string[]) => void;
};

export const AutocompleteContext = createContext<TAutocompleteContext>(null);
export const useAutocompleteContext = (): TAutocompleteContext => {
  const ctx = useContext(AutocompleteContext);

  if (!ctx) {
    throw new Error('Компоненты выпадашки должны быть обёрнуты в компонент <Autocomplete />.');
  }

  return ctx;
};

function Autocomplete(props: AutocompleteProps) {
  const {
    children,
    smooth = false,
    disabled = false,
    onFirstDropAll = false,
    isMultiple = false,
    max = Infinity,
    showActiveCodes = false,
  } = props;

  const cn = bem('Autocomplete');
  const uid = useMemo(() => window.crypto.randomUUID(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropOnTop, setDropOnTop] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(props.value) ? props.value : [props.value]
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<Scrollbar>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const firstActiveOptionRef = useRef<HTMLDivElement | null>(null);
  const firstOptionRef = useRef<HTMLDivElement | null>(null);

  const helpers = {
    onSpaceDown: (...handlers: ((...args: any[]) => void)[]): React.KeyboardEventHandler => {
      const handler: React.KeyboardEventHandler = (e: React.KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          handlers.forEach((handler) => handler());
        }
      };

      return handler;
    },

    deleteOption: (option: TOption) => {
      callbacks.removeActive(option);
    },
  };

  const callbacks = {
    setActive: (item: TOption) => {
      if (!isMultiple) {
        setSelected([item._id]);
        props.onSelected?.(item);
        setIsOpen(false);
      } else {
        if (onFirstDropAll) {
          if (item._id === props.options[0]._id) {
            setSelected([item._id]);
            return;
          } else if (selected[0] === props.options[0]._id) {
            setSelected((prevSelected) => prevSelected.slice(1));
          }
        }

        setSelected((prevSelected) => [...prevSelected, item._id]);
        props.onSelected?.(item);
      }
    },

    removeActive: (item: TOption) => {
      const newSelected = selected.filter((option) => option !== item._id);
      setSelected(newSelected);

      if (!isOpen) {
        props.onRemoveCodes?.(newSelected);
      }

      if (!newSelected.length) {
        setSelected([props.options[0]._id]);
      }
    },

    setSearch: (value: string) => {
      setSearch(value);
    },

    toggleOpen: () => {
      setIsOpen((prevOpen) => !prevOpen);
    },

    close: () => {
      props.onClose(selected);
      setIsOpen(false);
    },
  };

  const values = {
    selected,
    search,
    isOpen,
    isMultiple,

    active: useMemo<TOption | TOption[]>(() => {
      if (isMultiple) {
        return selected.map((id) => props.options.find((option) => option._id === id));
      }

      return (
        props.options.find((option) => option._id === props.value) ?? {
          _id: null,
          code: null,
          title: null,
        }
      );
    }, [props.value, props.options, props.placeholder, isMultiple, selected]),
  };

  // Более системная информация о дальнейших отображаемых данных
  const options = {
    activeTitle: Array.isArray(values.active) ? values.active[0]?.title : values.active.title,
    activeCode: Array.isArray(values.active) ? values.active[0]?.code : values.active.code,
    restLength: selected.slice(1).length,
    isMultipleSelected: Array.isArray(values.active) && values.active.length > 1,
    showActiveCodes,
  };

  // Отображение, понятное пользователю
  const views = {
    activeTitle: options.activeTitle
      ? simplifyName(sliceLongString(options.activeTitle, 10), options.restLength)
      : props.placeholder,
    activeCode: options.activeCode,
  };

  useOnClickOutside(wrapperRef, { triggerByEsc: true }, callbacks.close);

  useEffect(() => {
    if (disabled) return;

    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Tab') return;
      if (e.code.startsWith('Arrow')) e.preventDefault();

      // Более оптимизированный подход (список не ререндерится)
      // Подход с useMemo - много занимает по памяти
      // Подход с useState - ререндеры при перемещении
      switch (e.code) {
        case 'ArrowDown': {
          let nextElement = document.activeElement.nextElementSibling as HTMLElement;
          while (nextElement && !nextElement?.hasAttribute('tabindex')) {
            nextElement = nextElement.nextElementSibling as HTMLElement;
          }

          if (!nextElement) {
            if (document.activeElement === searchRef.current && firstActiveOptionRef.current) {
              firstActiveOptionRef.current?.focus();
            } else {
              firstOptionRef.current?.focus();
            }
          } else nextElement?.focus();

          break;
        }
        case 'ArrowUp': {
          let prevElement = document.activeElement.previousElementSibling as HTMLElement;
          while (prevElement && !prevElement?.hasAttribute('tabindex')) {
            prevElement = prevElement.previousElementSibling as HTMLElement;
          }

          if (!prevElement) {
            if (document.activeElement === searchRef.current) return;

            if (
              firstActiveOptionRef.current &&
              document.activeElement !== firstActiveOptionRef.current
            ) {
              let nextActiveElem = firstActiveOptionRef.current.nextElementSibling as HTMLElement;
              // Ищем последний пункт
              while (
                nextActiveElem &&
                nextActiveElem?.hasAttribute('tabindex') &&
                nextActiveElem.nextElementSibling
              ) {
                nextActiveElem = nextActiveElem.nextElementSibling as HTMLElement;
              }
              nextActiveElem?.focus();
            } else searchRef.current?.focus();
          } else prevElement?.focus();

          break;
        }
      }
    };

    wrapperRef.current?.addEventListener('keydown', listener);

    return () => {
      wrapperRef.current?.removeEventListener('keydown', listener);
    };
  }, [disabled, isOpen, values.active]);

  useEffect(() => {
    if (isOpen) props.onOpen();
    else props.onClose(selected);
  }, [isOpen]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      const isBottomNear =
        document.body.clientHeight - wrapperRef.current.offsetTop < dropRef.current.clientHeight;
      setDropOnTop(isBottomNear);
    });
  }, [disabled, isOpen]);

  useEffect(() => {
    setSelected(Array.isArray(props.value) ? props.value : [props.value]);
  }, [props.value]);

  useLayoutEffect(() => {
    if (selected.length > max) {
      alert(`Максимум ${max} выбранных стран!`);
      setSelected(selected.slice(0, max));
    }
  }, [selected]);

  return (
    <div ref={wrapperRef} className={cn({ active: isOpen, smooth, disabled })}>
      <div
        onClick={callbacks.toggleOpen}
        onKeyDown={helpers.onSpaceDown(callbacks.toggleOpen)}
        tabIndex={0}
        aria-label='Выбор страны'
        aria-controls={uid}
        aria-expanded={isOpen}
        className={cn('row')}
      >
        <div className={cn('inner')}>
          <AutocompleteField isDisabled={true} code={views.activeCode} title={views.activeTitle} />

          <div className={cn('marker')}>
            <img className={cn('marker-image')} src={Arrow} alt='' aria-hidden='true' />
          </div>
        </div>
      </div>

      {/* Выпадашка */}
      <div className={cn('drop')} id={uid}>
        <div ref={dropRef} className={cn('drop-inner', { top: dropOnTop })}>
          {isOpen && (
            <AutocompleteContext.Provider
              value={{
                values,
                helpers,
                options,
                callbacks,
                listRef,
                searchRef,
                firstOptionRef,
                firstActiveOptionRef,
                disabled,
              }}
            >
              {children}
            </AutocompleteContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
}

export default {
  Root: memo(Autocomplete),
  Search: memo(AutocompleteSearch),
  List: memo(AutocompleteList),
  Option: memo(AutocompleteOption),
  Variants: memo(AutocompleteVariants),
};
