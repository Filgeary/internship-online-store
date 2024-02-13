import React, {memo} from "react";
import PropTypes from 'prop-types';
import { IControlsProps } from "./types";
import './style.css';

function Controls({onAdd}: IControlsProps){
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>Добавить</button>
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
