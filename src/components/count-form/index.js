import React, { memo, useCallback, useRef, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import PropTypes from "prop-types";

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
        <h3>
          {props.title} (1-99), {props.basketUnit}:
        </h3>
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
          {props.ok}
        </button>
        <button
          type="button"
          className={cn("btn")}
          onClick={callbacks.closeModal}
        >
          {props.cancel}
        </button>
      </div>
    </form>
  );
};

CountForm.propTypes = {
  onSubmit: PropTypes.func,
  closeModal: PropTypes.func,
  basketUnit: PropTypes.string,
  title: PropTypes.string,
  ok: PropTypes.string,
  cancel: PropTypes.string,
};

CountForm.defaultProps = {
  onSubmit: () => {},
  closeModal: () => {},
  basketUnit: "шт",
  title: "Введите количество товара",
  ok: "Ок",
  cancel: "Отмена",
};

export default memo(CountForm);
