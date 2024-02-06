import {memo} from "react";
import './style.css';

interface ControlsProps {
  onAdd: () => Promise<void>;
  labelChoice: string;
}

function Controls({onAdd, labelChoice}: ControlsProps){
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>{labelChoice}</button>
    </div>
  )
}

export default memo(Controls);
