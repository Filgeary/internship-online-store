import { memo } from 'react';
import { ControlsPropsType } from './type';
import './style.css';

function Controls({onAdd}: ControlsPropsType){
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>Добавить</button>
    </div>
  )
}

export default memo(Controls);
