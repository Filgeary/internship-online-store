import { memo } from "react";

import "./style.css";

function CountPicker({ callbacks, count, title }) {
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
