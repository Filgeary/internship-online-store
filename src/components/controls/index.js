import {memo} from "react";
import PropTypes from 'prop-types';
import './style.css';

function Controls({onAdd, labelChoice}){
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>{labelChoice}</button>
    </div>
  )
}

Controls.propTypes = {
  onAdd: PropTypes.func,
  labelChoice: PropTypes.string
};

Controls.defaultProps = {
  labelChoice: "Выбрать еще товар",
  onAdd: () => {}
}

export default memo(Controls);
