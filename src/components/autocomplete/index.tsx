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

type AutocompleteProps = {
  children: React.ReactNode;
  placeholder?: string;
  onSelected: (option: TOption) => void;
  options: Array<TOption>;
  value: string;
  smooth?: boolean;
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
  const { children, placeholder, onSelected, options, value, smooth = false } = props;

  const cn = bem('Autocomplete');
  const uid = useMemo(() => window.crypto.randomUUID(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [inFocus, setInFocus] = useState<number>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<Scrollbar>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const firstOptionRef = useRef<HTMLDivElement | null>(null);

  const callbacks = {
    setActive: (item: TOption) => {
      onSelected(item);
      setIsOpen(false);
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
    isOpen,
    search,
    inFocus,

    active: useMemo<TOption>(() => {
      return (
        options.find((option) => option._id === value) ?? { _id: null, code: null, title: null }
      );
    }, [value, options, placeholder]),
  };

  useOnClickOutside(wrapperRef, { closeByEsc: true }, callbacks.close);

  useEffect(() => {
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

          if (!nextElement) firstOptionRef.current.focus();
          else nextElement?.focus();

          break;
        }
        case 'ArrowUp': {
          let prevElement = document.activeElement.previousElementSibling as HTMLElement;
          while (prevElement && !prevElement?.hasAttribute('tabindex')) {
            prevElement = prevElement.previousElementSibling as HTMLElement;
          }

          if (!prevElement) searchRef.current.focus();
          else prevElement?.focus();

          break;
        }
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className={cn({ active: isOpen, smooth })}>
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
          <AutocompleteField
            isDisabled={true}
            code={values.active.code}
            title={values.active.title}
          />

          <div className={cn('marker')}>
            <img className={cn('marker-image')} src={Arrow} alt='' aria-hidden='true' />
          </div>
        </div>
      </div>

      {/* Выпадашка */}
      <div className={cn('drop')} id={uid}>
        <div className={cn('drop-inner')}>
          {isOpen && (
            <AutocompleteContext.Provider
              value={{
                values,
                helpers,
                callbacks,
                listRef,
                searchRef,
                firstOptionRef,
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
