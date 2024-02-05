import React, {memo} from 'react';
import './style.css'
import PropTypes from "prop-types";
// Наложение фона
function Backdrop({isOpen}) {
  return isOpen ? <div className="backdrop" /> : null;
}

Backdrop.propTypes = {
  isOpen: PropTypes.bool,
};

Backdrop.defaultProps = {
  isOpen: false,
}

export default memo(Backdrop);
