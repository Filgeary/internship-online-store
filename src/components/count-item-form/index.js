import { useState, memo } from "react";
import PropTypes from "prop-types";
import { cn as bem } from "@bem-react/classname";
import 'style.css';

function CountItemForm(props) {
  const cn = bem("CountItemForm");
  const [count, setCount] = useState("1");

  const callbacks = {
    onChange: (e) => {
      let value = Number(e.target.value).toString().slice(0, 3);
      setCount(value);
    },
    onSubmit: (e) => {
      e.preventDefault();
      props.onSubmit(count);
    }
  }

  return (
    <form onSubmit={callbacks.onSubmit} className={cn()}>
      <div className={cn("field")}>
        <label htmlFor="count" className={cn("label")}>
          {props.labelCount}
        </label>
        <input
          id="count"
          type="number"
          min={1}
          value={count}
          onChange={callbacks.onChange}
          className={cn("input")}
        />
      </div>
      <div className={cn("buttons")}>
        <button className={cn("cancel")} type="button" onClick={props.onCancel}>
          {props.labelCancel}
        </button>
        <button className={cn("submit")} type="submit">
          OK
        </button>
      </div>
    </form>
  );
}

CountItemForm.propTypes = {
  labelCount: PropTypes.string,
  labelCancel: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default memo(CountItemForm);
