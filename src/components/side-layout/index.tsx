import { cn as bem } from '@bem-react/classname';
import * as React from 'react';
import { memo } from 'react';

import './style.css';

type Props = {
  children: React.ReactNode;
  side?: 'start' | 'end' | 'between' | 'center';
  padding?: 'small' | 'medium';
  direction?: 'row' | 'column';
};

function SideLayout({ children, side, padding, direction }: Props) {
  const cn = bem('SideLayout');

  return (
    <div className={cn({ side, padding, direction })}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={cn('item')}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default memo(SideLayout);
