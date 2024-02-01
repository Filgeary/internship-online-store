import {memo} from "react";
import PropTypes from 'prop-types';
import './style.css';

function Controls({onAdd, title}){
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>{title}</button>
    </div>
  )
}

Controls.propTypes = {
  onAdd: PropTypes.func
};

Controls.defaultProps = {
  onAdd: () => {}
}

export default memo(Controls);
