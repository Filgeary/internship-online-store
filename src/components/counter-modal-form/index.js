import { memo, useState } from "react";
import PropTypes from "prop-types";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

function CounterModalForm({ minInputValue, maxInputValue, t, ...props }) {
  const [count, setCount] = useState(minInputValue);

  const callbacks = {
    onChange: (e) => {
      if (e.target.value > maxInputValue) {
        setCount(maxInputValue);
      } else if (e.target.value < 0) {
        setCount(minInputValue);
      } else {
        setCount(e.target.value);
      }
    },
    onBlur: (e) => {
      if (e.target.value == "") {
        setCount(0);
      }
    },
  };

  const cn = bem("CounterModalForm");
  return (
    <div className={cn("center")}>
      <form>
        <div className={cn("center")}>
          <h3>{t("couter-modal.form.title")}</h3>
          <input
            value={count}
            className={cn("input")}
            type="number"
            onChange={(e) => callbacks.onChange(e)}
            onBlur={(e) => callbacks.onBlur(e)}
          />
        </div>
        <div className={cn("right")}>
          <button type="button" onClick={props.onCancel} className={cn("button")}>
            Отмена
          </button>
          <button
            className={cn("button")}
            disabled={Number(count) < minInputValue}
            type="button"
            onClick={() => props.onSubmit(count)}
          >
            Ок
          </button>
        </div>
      </form>
    </div>
  );
}

CounterModalForm.propTypes = {
  minInputValue: PropTypes.number,
  maxInputValue: PropTypes.number,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  t: PropTypes.func,
};

CounterModalForm.defaultProps = {
  onSubmit: (count) => {},
  onCancel: () => {},
  t: (text) => text,
};

export default memo(CounterModalForm);
