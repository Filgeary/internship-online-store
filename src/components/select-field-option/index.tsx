/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { cn as bem } from '@bem-react/classname';

import type { ISelectOption } from '@src/types';

import './style.css';

type Props = {
  item: ISelectOption;
  onSelectItem: (item: ISelectOption) => void;
  isActive: boolean;
  isSelected: boolean;
};

export function SelectFieldOption({ item, onSelectItem, isActive, isSelected }: Props) {
  const cn = bem('SelectFieldOption');

  return (
    <div
      key={item._id}
      title={item.title}
      className={cn('option', {
        active: isActive,
        selected: isSelected,
      })}
      onClick={() => onSelectItem(item)}
      role='option'
      aria-selected={isActive}
      tabIndex={-1}
    >
      <span className={cn('value')}>{item.value || ''}</span>
      <span className={cn('label')}>{item.title}</span>
    </div>
  );
}
