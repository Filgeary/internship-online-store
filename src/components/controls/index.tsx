import { memo } from "react";
import "./style.css";

interface IControlsProps {
  onAdd: () => void;
  title: string;
}

const Controls: React.FC<IControlsProps> = ({ onAdd, title }) => {
  return (
    <div className="Controls">
      <button onClick={() => onAdd()}>{title}</button>
    </div>
  );
};

export default memo(Controls);
