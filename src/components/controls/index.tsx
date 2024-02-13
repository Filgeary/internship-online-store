import {memo} from "react";
import './style.css';

interface ContlolsProps {
  onAdd: () => void,
}

function Controls({onAdd}: ContlolsProps){
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>Добавить</button>
    </div>
  )
}

export default memo(Controls);
