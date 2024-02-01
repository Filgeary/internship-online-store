import './style.css';

import React from 'react';
import PropTypes from 'prop-types';

import { cn as bem } from '@bem-react/classname';

function SuccessBlock({ children }) {
  const cn = bem('SuccessBlock');

  return (
    <div className={cn()}>
      {children}
    </div>
  );
}

SuccessBlock.propTypes = {
  children: PropTypes.string,
};

export default SuccessBlock;