import React from 'react';
import './style.css';
import PropTypes from 'prop-types';

function BasketFooter({ children }) {
  return (
    <div className="BasketFooter">
      {children}
    </div>
  )
}

BasketFooter.propTypes = {
  children: PropTypes.node,
};

export default BasketFooter;