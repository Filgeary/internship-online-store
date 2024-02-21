/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';
import { unescape } from 'he';
// import { type IItemSelectCustom } from './types';
import './style.css';

// TODO: типизировать пропсы
function ItemSelectCustom(props: any) {
  const { item, onSelect, onMouseEnter, onMouseLeave, selectedItem, hoveredItemId } = props;
  const { title, code, _id } = item;

  const cn = bem('ItemSelectCustom');

  const callbacks = {
    setId: () => onMouseEnter(_id),
    onSetSelected: () => onSelect(_id),
  };

  const selectedItemId = selectedItem.find((itemId: string) => itemId === _id);
  const selected = selectedItemId && selectedItemId !== '0';
  const hovered = hoveredItemId === _id;
  const longLine = title.length > 25;

  return (
    <div className={cn()}>
      <div
        className={cn(`content${hovered ? '_hovered' : ''}`, { longLine, selected })}
        onMouseEnter={callbacks.setId}
        onMouseLeave={onMouseLeave}
        onClick={callbacks.onSetSelected}
      >
        <div className={cn('langCode')}>{code}</div>
        <div className={cn('title')}>{unescape(title)}</div>
        {!hovered && !selected && longLine && <div className={cn('gradient')} />}
        {!hovered && selected && longLine && <div className={cn('gradientSelected')} />}
      </div>
    </div>
  );
}

export default memo(ItemSelectCustom);
