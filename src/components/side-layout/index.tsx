import React, {memo} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import type { SideLayoutProps } from "./types";
import './style.css';

function SideLayout({children, side, padding}: SideLayoutProps) {
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding})}>
      {React.Children.map(children, (child) => (
        <div key={child.key || undefined} className={cn('item')}>{child}</div>
      ))}
    </div>
  );
}

SideLayout.propTypes = {
  children: PropTypes.node,
  side: PropTypes.oneOf(['start', 'end', 'between']),
  padding: PropTypes.oneOf(['small', 'medium']),
}

SideLayout.defaultProps = {};

export default memo(SideLayout);
