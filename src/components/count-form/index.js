import React, { memo, useCallback, useRef, useState } from "react";
import { cn as bem } from "@bem-react/classname";

import "./style.css";

const CountForm = (props) => {
  const frame = useRef();
  const cn = bem("CountForm");
  const [count, setCount] = useState(0);

  const callbacks = {
    onChange: useCallback(
      (e) => {
        setCount(parseInt(e.target.value));
      },
      [count]
    ),

    onSubmit: (e) => {
      e.preventDefault();
      props.onSubmit(count);
    },

    closeModal: () => {
      props.closeModal();
    },
  };

  return (
    <form onSubmit={callbacks.onSubmit} className={cn()}>
      <div className={cn("frame")} ref={frame}>
        <h3>Введите количество товара (1-99), шт:</h3>
        <input
          name="count"
          type="number"
          // defaultValue={0}
          step="1"
          placeholder="1-99"
          min={1}
          max={99}
          onChange={callbacks.onChange}
          required
          className={cn("input")}
        />
        <button type="submit" className={cn("btn")}>
          {"Ok"}
        </button>
        <button
          type="button"
          className={cn("btn")}
          onClick={callbacks.closeModal}
        >
          {"Cancel"}
        </button>
      </div>
    </form>
  );
};

export default memo(CountForm);
