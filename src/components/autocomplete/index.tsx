import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import Arrow from '@src/assets/images/arrow.svg';

import './style.css';
import { cn as bem } from '@bem-react/classname';

import useOnClickOutside from '@src/hooks/use-on-click-outside';
import debounce from 'lodash.debounce';

import Option from './option';
import Search from './search';
import List from './list';

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
};

export const AutocompleteContext = createContext<TAutocompleteContext>(null);
export const useAutocomplete = () => {
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
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debounceFn = useCallback(
    debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
    debouncedSearch,

    active: useMemo<TOption>(() => {
      return (
        options.find((option) => option._id === value) ??
        options[0] ?? { _id: null, code: null, title: null }
      );
    }, [value, options, placeholder]),
  };

  useOnClickOutside(wrapperRef, callbacks.close);

  return (
    <div ref={wrapperRef} className={cn({ active: isOpen })}>
      <AutocompleteContext.Provider value={{ values, helpers, callbacks, listRef }}>
        <div
          onClick={callbacks.toggleOpen}
          onKeyDown={helpers.onSpaceDown(callbacks.toggleOpen)}
          tabIndex={0}
          aria-controls={uid}
          aria-expanded={isOpen}
          className={cn('row')}
        >
          <div className={cn('inner')}>
            <Option disabled={true} option={values.active} isTitle />

            <div className={cn('marker')}>
              <img className={cn('marker-image')} src={Arrow} alt='' aria-hidden='true' />
            </div>
          </div>
        </div>

        {/* Выпадашка */}
        {isOpen && (
          <div className={cn('drop')} id={uid}>
            <div className={cn('drop-inner')}>
              {/* <AutocompleteContext.Provider value={{ values, helpers, callbacks }}> */}
              {children}
              {/* </AutocompleteContext.Provider> */}
            </div>
          </div>
        )}
      </AutocompleteContext.Provider>
    </div>
  );
}

export default {
  Root: memo(Autocomplete),
  Search: memo(Search),
  List: memo(List),
  Option: memo(Option),
};
