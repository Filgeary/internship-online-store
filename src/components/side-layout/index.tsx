import React, {ReactNode, memo} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import type { SideLayoutProps } from "./type";
import './style.css';

function SideLayout({children, side, padding}: SideLayoutProps) {
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding})}>
      {React.Children.map(children, (child, key) => (
        <div key={key} className={cn('item')}>{child}</div>
      ))}
    </div>
  );
}

export default memo(SideLayout);
