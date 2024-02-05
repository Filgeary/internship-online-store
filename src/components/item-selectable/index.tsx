import './style.css';

import React, {memo} from "react";

import {cn as bem} from '@bem-react/classname';

import numberFormat from "@src/utils/number-format";
import { TItem } from '@src/types/item';

type ItemSelectableProps = {
  item: TItem;
  link: string;
  onClick: () => void;
  onDelete: () => void;
  labelCurr: string,
  labelDelete: string,
  count: number | null,
  appendix: (count: number) => string;
};

const defaultProps: Omit<ItemSelectableProps, "item" | "appendix" | "link"> = {
  count: null,
  onClick: () => {},
  onDelete: () => {},
  labelCurr: '₽',
  labelDelete: 'Удалить',
};

ItemSelectable.defaultProps = defaultProps;

function ItemSelectable(props: ItemSelectableProps){
  const cn = bem('ItemSelectable');

  const options = {
    selectable: !props.count,
    block: props.count > 0,
    
    showAppendix: props.count > 0,
    // selectable: true,
    // block: false,
  };

  const callbacks = {
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      props.onDelete();
    },
  };

  return (
    <div
      onClick={props.onClick}
      className={cn({ selectable: options.selectable, block: options.block })}
    >
      <div className={cn('title')}>
        <span>{props.item.title}</span>
        {options.showAppendix && <span> | {props.appendix(props.count)}</span>}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        {
          props.count && (
            <button
              onClick={callbacks.onDelete}
            >
              {props.labelDelete}
            </button>
          )
        }
      </div>
    </div>
  );
}

export default memo(ItemSelectable);
