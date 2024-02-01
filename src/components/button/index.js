import {memo} from "react";
import PropTypes from 'prop-types';
import './style.css';

function Button({title ,onClick}){
  return (
    <div className='Controls'>
      <button onClick={() => onClick()}>{title}</button>
    </div>
  )
}

Button.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func
};

Button.defaultProps = {
  onClick: () => {}
}

export default memo(Button);
