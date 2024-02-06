import React, { memo, FC } from "react";
import './style.css';

interface ControlsProps {
  onAdd?: () => void;
  title: string;
}

const Controls: FC<ControlsProps> = ({ onAdd = () => {}, title }) => {
  return (
    <div className='Controls'>
      <button onClick={onAdd}>{title}</button>
    </div>
  );
}
export default memo(Controls);
