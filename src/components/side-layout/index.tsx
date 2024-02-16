import { cn as bem } from '@bem-react/classname';
import React, { memo } from 'react';

import './style.css';

type Props = {
  children: React.ReactNode;
  side?: 'start' | 'end' | 'between' | 'center';
  padding?: 'small' | 'medium';
};

function SideLayout({ children, side, padding }: Props) {
  const cn = bem('SideLayout');

  return (
    <div className={cn({ side, padding })}>
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
