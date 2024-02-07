import React, { memo } from 'react';
import { cn as bem } from '@bem-react/classname';
import './style.css';

type SideLayoutProps = {
  children: React.ReactNode;
  side?: 'start' | 'end' | 'between';
  padding?: 'small' | 'medium';
};

function SideLayout({ children, side, padding }: SideLayoutProps) {
  const cn = bem('SideLayout');

  return (
    <div className={cn({ side, padding })}>
      {React.Children.map(children, (child: any) => (
        <div key={child.key} className={cn('item')}>
          {child}
        </div>
      ))}
    </div>
  );
}

export default memo(SideLayout);
