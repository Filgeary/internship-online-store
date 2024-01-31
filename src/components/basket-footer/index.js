import './style.css';

import React from 'react';
import { cn as bem } from '@bem-react/classname';

import PropTypes from 'prop-types';

function BasketFooter({ children }) {
  const cn = bem('BasketFooter');

  return (
    <div className={cn()}>
      {children}
    </div>
  )
}

BasketFooter.propTypes = {
  children: PropTypes.node,
};

export default BasketFooter;