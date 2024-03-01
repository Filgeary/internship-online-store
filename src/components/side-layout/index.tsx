import React, {ReactNode, memo} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import type { SideLayoutProps } from "./type";
import './style.css';

function SideLayout({children, side, padding, direction, minHeight}: SideLayoutProps) {
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding, direction})} style={{minHeight: `${minHeight}px`}}>
      {React.Children.map(children, (child, key) => (
        <div key={key} className={cn('item')}>{child}</div>
      ))}
    </div>
  );
}

export default memo(SideLayout);
