import { memo } from "react";

import "./style.css";

type CountPickerProps = {
  callbacks: {
    removeCount: () => void;
    addCount: () => void;
    onAdd: () => void;
  };
  count: number;
  title: string;
};

function CountPicker({ callbacks, count, title }: CountPickerProps) {
  return (
    <div className="CountPicker">
      <div className="CountPicker-title">{title}</div>

      <div className="CountPicker-counter">
        <button
          onClick={callbacks.removeCount}
          className="CountPicker-counter-button"
          disabled={count < 2}
        >
          -
        </button>
        <span className="CountPicker-counter-value">{count} шт.</span>
        <button
          onClick={callbacks.addCount}
          className="CountPicker-counter-button"
        >
          +
        </button>
      </div>

      <button onClick={callbacks.onAdd} className="CountPicker-add">
        Добавить
      </button>
    </div>
  );
}

export default memo(CountPicker);
