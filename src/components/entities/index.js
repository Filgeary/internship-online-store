import './style.css';

import React from 'react'
import PropTypes from 'prop-types';

import { cn as bem } from '@bem-react/classname';

function Entities({ children }) {
  const cn = bem('Entities');
  
  return (
    <div className={cn()}>
      {children}
    </div>
  );
}

Entities.propTypes = {
  children: PropTypes.node,
};

export default Entities;
