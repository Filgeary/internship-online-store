/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';
import { ESelectCustomViewMenuPlacement as MenuPlacement } from '@src/components/select-custom-view/types';
import { icons } from './assets';
import './style.css';

// TODO: типизировать пропсы
function SelectCustomView(props: any) {
  const { checkNode, menuPlacement, selectedItem, onSelectClick, menuOpen } = props;
  const cn = bem('SelectCustomView');

  return (
    <div className={cn()}>
      <div className={cn('select')} ref={checkNode} tabIndex={0} role="menu" onClick={onSelectClick}>
        <div className={cn('country')}>
          {/* TODO: это временное решение, потом будет что-то более универсальное */}
          <div className={cn('langCode')}>RU</div>
          <div className={cn('title')}>{selectedItem.at(0)?.title}</div>
        </div>
        <div className={cn('icon', { menuOpen })}>{icons.chevronDown}</div>
      </div>
      {/* TODO: тут компоненты поиска и списка будут */}
      {menuOpen && <div className={cn('menu', { palacement: menuPlacement })} />}
    </div>
  );
}

export default memo(SelectCustomView);
