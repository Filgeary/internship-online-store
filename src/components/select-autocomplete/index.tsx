/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { cn as bem } from '@bem-react/classname';
import { memo, useEffect, useRef, useState } from 'react';

import { useClickOutside } from '@src/hooks/use-click-outside';
import IconChevronDown from '../icon-chevron-down';
import Spinner from '../spinner';

import type { ISelectOption } from '@src/types';

import './style.css';

type Props = {
  options: ISelectOption[];
  onSelected: (item: ISelectOption) => void;
  selectedItem: ISelectOption | null;
  isPending?: boolean;
  onOpen?: () => void;
};

const SelectAutocomplete = ({ options, selectedItem, onSelected, isPending, onOpen }: Props) => {
  const cn = bem('SelectAutocomplete');

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState(options);
  const [activeIndex, setActiveIndex] = useState(-1); // To track selected item in list

  const inputRef = useRef<HTMLInputElement>(null);
  const listItemsRefs = useRef<HTMLLIElement[]>([]);
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);

  // call callbacks on open
  useEffect(() => {
    if (isOpen) onOpen?.();
  }, [isOpen, onOpen]);

  // filter items & set active index
  useEffect(() => {
    const filterItems = (value: string) => {
      if (!value) {
        setFilteredItems(options);
        setActiveIndex(-1); // Reset active index when no input
        return;
      }

      const filtered = options.filter(item =>
        item.title.toLowerCase().startsWith(value.toLowerCase()),
      );

      setFilteredItems(filtered);
      setActiveIndex(0); // Set active index to first item by default
    };

    filterItems(inputValue);
  }, [inputValue, options]);

  const handleReset = () => {
    setInputValue('');
    setActiveIndex(-1);
  };

  const handleOpen = () => {
    setIsOpen(true);
    handleReset();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    handleReset();
  };

  const handleToggleMenu = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  useClickOutside(comboboxWrapperRef, handleClose);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelectItem = (item: ISelectOption) => {
    onSelected(item);
    handleReset();
    setIsOpen(false);
  };

  const scrollToActiveItem = (index: number) => {
    listItemsRefs.current[index]?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    const { key } = event;

    if (key === 'Enter' && activeIndex >= 0) {
      // Handle Enter to select active item
      handleSelectItem(filteredItems[activeIndex]);
    } else if (key === 'ArrowDown' && activeIndex < filteredItems.length - 1) {
      // Handle ArrowDown to move down
      setActiveIndex(activeIndex + 1);
      scrollToActiveItem(activeIndex + 1);
      inputRef.current?.focus(); // Maintain focus on input
    } else if (key === 'ArrowUp' && activeIndex > 0) {
      // Handle ArrowUp to move up
      setActiveIndex(activeIndex - 1);
      scrollToActiveItem(activeIndex - 1);
      inputRef.current?.focus(); // Maintain focus on input
    } else if (key === 'Escape' || key === 'Tab') {
      // Handle Escape & Tab to close the combobox
      setIsOpen(false);
      handleReset();
    }
  };

  return (
    <div className={cn()}>
      <div
        className={cn('control', { open: isOpen })}
        onClick={handleToggleMenu}
        onKeyDown={evt => evt.key === 'Enter' && handleToggleMenu()}
        tabIndex={0}
        role='button'
      >
        <div className={cn('option')}>
          <span className={cn('value')}>{selectedItem?.value || ''}</span>
          <span className={cn('label')}>{selectedItem?.title || 'Все'}</span>
        </div>

        <div className={cn('icon', { open: isOpen })}>
          <IconChevronDown />
        </div>
      </div>

      {isOpen && (
        <div
          className={cn('comboboxWrapper')}
          ref={comboboxWrapperRef}
        >
          <input
            type='text'
            value={inputValue}
            placeholder='Поиск'
            className={cn('input')}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />

          <Spinner active={Boolean(isPending)}>
            {filteredItems.length > 0 && (
              <ul className={cn('list')}>
                {filteredItems.map((item, index) => (
                  <li
                    key={item._id}
                    className={cn('listItem')}
                    ref={elem => (elem ? (listItemsRefs.current[index] = elem) : null)}
                  >
                    <div
                      className={cn('option', {
                        active: index === activeIndex,
                        selected: item._id === selectedItem?._id,
                      })}
                      onClick={() => handleSelectItem(item)}
                      role='option'
                      aria-selected={index === activeIndex}
                      tabIndex={-1}
                    >
                      <span className={cn('value')}>{item.value || ''}</span>
                      <span className={cn('label')}>{item.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Spinner>
        </div>
      )}
    </div>
  );
};

export default memo(SelectAutocomplete);
