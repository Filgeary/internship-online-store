import { memo } from "react";
import "./style.css";

type TControlsProps = {
  onAdd: () => void;
  title: string;
};

function Controls({ onAdd, title }: TControlsProps) {
  return (
    <div className="Controls">
      <button onClick={() => onAdd()}>{title}</button>
    </div>
  );
}

 Controls.defaultProps = {
  onAdd: () => {},
  title: "Добавить",
};

export default memo(Controls);
