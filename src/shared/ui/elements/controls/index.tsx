import React, { memo, FC } from "react";
import './style.css';

interface ControlsProps {
  onAdd?: () => void;
  title: string;
  padding?: 'none' | 'small' | 'middle'
}

const Controls: FC<ControlsProps> = ({ onAdd = () => {}, title, padding = 'middle' }) => {
  return (
    <div className={'ControlContainer' + ' ' + padding}>
      <button className={'Control'} onClick={onAdd}>{title}</button>
    </div>
  );
}
export default memo(Controls);
