import React, {
  createContext,
  memo,
  useContext,
  useEffect,
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
import AutocompleteField from './autocomplete-field';
import simplifyName from '@src/utils/simplify-name';

type AutocompleteProps = {
  children: React.ReactNode;
  placeholder?: string;
  onSelected: (option: TOption) => void;
  options: Array<TOption>;
  value: string | string[];
  smooth?: boolean;
  onOpen?: () => void;
  onClose?: (ids: string[]) => void;
  onFirstDropAll?: boolean;
  disabled?: boolean;
};

export type TOption = {
  _id: string | null;
  code: string | null;
  title: string | null;
};

type TAutocompleteContext = {
  values: Record<string, any>;
  callbacks: Record<string, any>;
  helpers: Record<string, any>;
  listRef: React.RefObject<Scrollbar>;
  searchRef: React.RefObject<HTMLInputElement>;
  firstOptionRef: React.MutableRefObject<HTMLDivElement | null>;
  disabled: boolean;
};

export const AutocompleteContext = createContext<TAutocompleteContext>(null);
export const useAutocompleteContext = () => {
  const ctx = useContext(AutocompleteContext);

  if (!ctx) {
    throw new Error('Компоненты выпадашки должны быть обёрнуты в компонент <Autocomplete />.');
  }

  return ctx;
};

function Autocomplete(props: AutocompleteProps) {
  const { children, smooth = false, disabled = false, onFirstDropAll = false } = props;

  const isMultiple = Array.isArray(props.value);

  const cn = bem('Autocomplete');
  const uid = useMemo(() => window.crypto.randomUUID(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [inFocus, setInFocus] = useState<number>(null);
  const [dropOnTop, setDropOnTop] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(props.value) ? props.value : [props.value]
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<Scrollbar>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const firstOptionRef = useRef<HTMLDivElement | null>(null);

  const callbacks = {
    setActive: (item: TOption) => {
      if (!isMultiple) {
        setSelected([item._id]);
        props.onSelected(item);
        setIsOpen(false);
      } else {
        // Когда выбрано onFirstDropAll - сбрасываем при выборе первого все остальные
        if (onFirstDropAll && item._id === props.options[0]._id) {
          setSelected([item._id]);
          return;
        } else if (onFirstDropAll) {
          // Иначе - если выделен первый пункт - то снимаем его
          if (selected[0] === props.options[0]._id) {
            setSelected((prevSelected) => prevSelected.slice(1));
          }
        }

        setSelected((prevSelected) => [...prevSelected, item._id]);
      }
    },

    removeActive: (item: TOption) => {
      setSelected((prevSelected) => prevSelected.filter((option) => option !== item._id));
    },

    setSearch: (value: string) => {
      setSearch(value);
    },

    toggleOpen: () => setIsOpen((prev) => !prev),

    close: () => setIsOpen(false),

    setInFocus,
  };

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
  };

  const values = {
    selected,
    search,
    isOpen,
    inFocus,
    isMultiple,

    active: useMemo<TOption | TOption[]>(() => {
      if (isMultiple) {
        return props.options.filter((option) => selected.includes(option._id));
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
  };

  // Отображение, понятное пользователю
  const views = {
    activeTitle: options.activeTitle
      ? simplifyName(options.activeTitle, options.restLength)
      : props.placeholder,
    activeCode: options.activeCode,
  };

  useOnClickOutside(wrapperRef, { closeByEsc: true }, callbacks.close);

  useEffect(() => {
    if (disabled) return;

    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Tab') return;
      if (e.code.startsWith('Arrow')) e.preventDefault();

      // Более оптимизированный подход (список не ререндерится)
      switch (e.code) {
        case 'ArrowDown': {
          let nextElement = document.activeElement.nextElementSibling as HTMLElement;
          while (nextElement && !nextElement?.hasAttribute('tabindex')) {
            nextElement = nextElement.nextElementSibling as HTMLElement;
          }

          if (!nextElement) firstOptionRef.current?.focus();
          else nextElement?.focus();

          break;
        }
        case 'ArrowUp': {
          let prevElement = document.activeElement.previousElementSibling as HTMLElement;
          while (prevElement && !prevElement?.hasAttribute('tabindex')) {
            prevElement = prevElement.previousElementSibling as HTMLElement;
          }

          if (!prevElement) searchRef.current?.focus();
          else prevElement?.focus();

          break;
        }
      }
    };

    wrapperRef.current?.addEventListener('keydown', listener);

    return () => {
      wrapperRef.current?.removeEventListener('keydown', listener);
    };
  }, [disabled, isOpen]);

  useEffect(() => {
    if (isOpen) props.onOpen();
    else {
      props.onClose?.(selected);
      // setSelected([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const isBottomNear = document.body.clientHeight - wrapperRef.current.offsetTop < 117;
    setDropOnTop(isBottomNear);
  }, [disabled]);

  useEffect(() => {
    if (!isMultiple) {
      setSelected(Array.isArray(props.value) ? props.value : [props.value]);
    }
  }, [props.value]);

  useEffect(() => {
    console.log('@', selected);
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
        <div className={cn('drop-inner', { top: dropOnTop })}>
          {isOpen && (
            <AutocompleteContext.Provider
              value={{
                values,
                helpers,
                callbacks,
                listRef,
                searchRef,
                firstOptionRef,
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
};
