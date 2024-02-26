/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cn as bem } from '@bem-react/classname';
import { memo } from 'react';

import type { ISelectOption } from '@src/types';

import './style.css';

type Props = {
  selectedItems: ISelectOption[] | null;
  defaultSelectedItem: ISelectOption | null;
  isMulti?: boolean;
  onUnselect?: (item: ISelectOption[]) => void;
};

const SelectFieldBase = ({ selectedItems, defaultSelectedItem, isMulti, onUnselect }: Props) => {
  const cn = bem('SelectFieldBase');
  const selectedItem = selectedItems?.[0];

  const handleUnselect = (evt: React.MouseEvent, item: ISelectOption) => {
    evt.stopPropagation();
    onUnselect?.([item]);
  };

  return isMulti ? (
    selectedItems?.map(item => (
      <div
        key={item._id}
        className={cn('option')}
      >
        <span
          className={cn('value')}
          onClick={evt => handleUnselect(evt, item)}
          title={item.title}
          role='button'
          tabIndex={-1}
        >
          {item.value || defaultSelectedItem?.value}
        </span>
      </div>
    ))
  ) : (
    <div
      className={cn('option')}
      title={selectedItem?.title || defaultSelectedItem?.title}
    >
      <span className={cn('value')}>{selectedItem?.value || defaultSelectedItem?.value}</span>
      <span className={cn('label')}>{selectedItem?.title || defaultSelectedItem?.title}</span>
    </div>
  );
};

export default memo(SelectFieldBase);
