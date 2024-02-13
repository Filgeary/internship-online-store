import React, {memo} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import { ISideLayoutProps } from "./types";
import './style.css';

function SideLayout({children, side, padding}: ISideLayoutProps) {
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding})}>
      {React.Children.map(children, (child: React.ReactElement) => (
        <div key={child.key} className={cn('item')}>{child}</div>
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
