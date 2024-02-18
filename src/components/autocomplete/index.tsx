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
  listRef: React.RefObject<HTMLDivElement>;
  searchRef: React.RefObject<HTMLInputElement>;
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
  const { children, placeholder, onSelected, options, value } = props;

  const cn = bem('Autocomplete');
  const uid = useMemo(() => window.crypto.randomUUID(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [inFocus, setInFocus] = useState<number>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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
      // Более оптимизированный подход (список не ререндерится)
      if (e.code === 'Tab') return;
      if (e.code.startsWith('Arrow')) e.preventDefault();
      switch (e.code) {
        case 'ArrowDown': {
          let nextElement = null;
          while (
            document.activeElement.nextElementSibling &&
            !(nextElement = document.activeElement.nextElementSibling as HTMLElement).hasAttribute(
              'tabindex'
            )
          ) {}
          nextElement?.focus();
          break;
        }
        case 'ArrowUp': {
          let prevElement = null;
          while (
            document.activeElement.previousElementSibling &&
            !(prevElement = document.activeElement
              .previousElementSibling as HTMLElement).hasAttribute('tabindex')
          ) {}
          prevElement?.focus();
          break;
        }
      }
      // React-way (ререндерится весь список, все 228 элементов в худшем случае)
      // Т.к., меняется значение, которое потом идёт в контекст
      // if (e.code.startsWith('Arrow')) e.preventDefault();
      // switch (e.code) {
      //   case 'ArrowDown': {
      //     setInFocus((prevInFocus) => Math.min(prevInFocus + 1, options.length));
      //     break;
      //   }
      //   case 'ArrowUp': {
      //     setInFocus((prevInFocus) => Math.max(prevInFocus - 1, 0));
      //     break;
      //   }
      // }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  });

  return (
    <div ref={wrapperRef} className={cn({ active: isOpen })}>
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
        {isOpen && (
          <div className={cn('drop-inner')}>
            <AutocompleteContext.Provider
              value={{ values, helpers, callbacks, listRef, searchRef }}
            >
              {children}
            </AutocompleteContext.Provider>
          </div>
        )}
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
