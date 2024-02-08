import {memo} from "react";
import type { ControlsProps } from "./type";
import './style.css';

function Controls({onAdd, labelChoice}: ControlsProps){
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>{labelChoice}</button>
    </div>
  )
}

export default memo(Controls);
