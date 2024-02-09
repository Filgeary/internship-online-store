import { memo } from "react";
import "./style.css";

type ControlsProps = {
  onAdd: () => void;
};

function Controls({ onAdd }: ControlsProps) {
  return (
    <div className="Controls">
      <button onClick={() => onAdd()}>Добавить</button>
    </div>
  );
}

Controls.defaultProps = {
  onAdd: () => {},
};

export default memo(Controls);
