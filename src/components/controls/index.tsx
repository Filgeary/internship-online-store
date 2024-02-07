import { memo } from "react";

import './style.css';

type Props = {
  onAdd: () => void
}

function Controls({ onAdd }: Props) {
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>Добавить</button>
    </div>
  )
}

export default memo(Controls);
