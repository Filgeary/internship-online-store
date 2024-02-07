import { memo } from 'react';
import './style.css';

type ControlsProps = {
  onAdd?: () => void;
};

const defaultProps: ControlsProps = {
  onAdd: () => {},
};

Controls.defaultProps = defaultProps;

function Controls({ onAdd }: ControlsProps) {
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>Добавить</button>
    </div>
  );
}

export default memo(Controls);
