import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

export type TOption = {
  _id: string | null;
  code: string | null;
  title: string | null;
};

export type TAutocompleteContext = {
  values: {
    search: string;
    selected: string[];
    isOpen: boolean;
    isMultiple: boolean;
    dropOnTop: boolean;
    active: TOption | TOption[];
  };
  options: {
    isMultipleSelected: boolean;
    showActiveCodes: boolean;
  };
  callbacks: {
    setActive: (item: TOption) => void;
    removeActive: (item: TOption) => void;
    setSearch: (value: string) => void;
    toggleOpen: () => void;
    close: () => void;
  };
  helpers: {
    onSpaceDown: (...handlers: ((...args: any[]) => void)[]) => React.KeyboardEventHandler;
    deleteOption: (option: TOption) => void;
  };
  wrapperRef: React.RefObject<HTMLDivElement>;
  dropRef: React.RefObject<HTMLDivElement>;
  listRef: React.RefObject<Scrollbar>;
  searchRef: React.RefObject<HTMLInputElement>;
  firstOptionRef: React.MutableRefObject<HTMLDivElement | null>;
  firstActiveOptionRef: React.MutableRefObject<HTMLDivElement | null>;
  disabled: boolean;
};
