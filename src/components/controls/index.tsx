import { memo, FC } from "react";
import "./style.css";

interface IControls {
  onAdd: () => void;
  title: string;
}

const Controls: FC<IControls> = ({ onAdd, title }: IControls) => {
  return (
    <div className="Controls">
      <button onClick={() => onAdd()}>{title}</button>
    </div>
  );
};

export default memo(Controls);
