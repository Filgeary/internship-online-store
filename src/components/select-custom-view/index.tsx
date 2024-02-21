/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';
import { ESelectCustomViewMenuPlacement as MenuPlacement } from '@src/components/select-custom-view/types';
import { icons } from './assets';
import './style.css';

// TODO: типизировать пропсы
function SelectCustomView(props: any) {
  const { checkNode, menuPlacement, selectedItem, onSelectClick, menuOpen, items, children } = props;
  const selectedId = selectedItem.at(0);
  const item = items.find(({ _id }: Record<string, string>) => _id === selectedId);
  const lang = selectedId === '0' ? '' : item.code;
  const longLine = item.title.length > 22;
  const cn = bem('SelectCustomView');

  return (
    <div className={cn()}>
      <div className={cn('select', { palacement: menuPlacement, menuOpen })} ref={checkNode} tabIndex={0} role="menu" onClick={onSelectClick}>
        <div className={cn('country')}>
          {/* TODO: это временное решение, потом будет что-то более универсальное */}
          <div className={cn('langCode')}>{lang}</div>
          <div className={cn('title', { longLine })}>{items.find(({ _id }: Record<string, string>) => _id === selectedItem.at(0))?.title}</div>
        </div>
        {longLine && <div className={cn('gradient')} />}
        <div className={cn('icon', { menuOpen })}>{icons.chevronDown}</div>
      </div>
      {/* TODO: тут компоненты поиска и списка будут */}
      {menuOpen && <div className={cn('menu', { palacement: menuPlacement })}>{children}</div>}
    </div>
  );
}

export default memo(SelectCustomView);
