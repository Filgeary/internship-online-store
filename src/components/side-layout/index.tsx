import React, {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';

interface SideLayoutProps {
  children: React.ReactElement,
  side?: 'start' | 'end' | 'between' | 'center',
  padding?: 'small' | 'medium',
}

function SideLayout({children, side, padding}: SideLayoutProps) {
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding})}>
      {React.Children.map(children, (child) => (
        <div key={child.key} className={cn('item')}>{child}</div>
      ))}
    </div>
  );
}

export default memo(SideLayout);
