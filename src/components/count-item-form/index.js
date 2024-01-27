import { useState } from "react";
import PropTypes from "prop-types";
import { cn as bem } from "@bem-react/classname";
import 'style.css';

function CountItemForm(props) {
  const cn = bem("CountItemForm");
  const [count, setCount] = useState("1");
  const [successText, setSuccessText] = useState('');

  const callbacks = {
    onChange: (e) => {
      let value = Number(e.target.value).toString().slice(0, 3);
      setCount(value);
      setSuccessText('');
    },
    onSubmit: (e) => {
      e.preventDefault();
      const text = props.labelSuccess.replace("[count]", count).replace("[product]", props.title);
      setSuccessText(text);
      props.onSubmit(count);
    }
  }

  return (
    <form onSubmit={callbacks.onSubmit} className={cn()}>
      <div className={cn("success")}>{successText && <span>{successText}</span>}</div>
      <div className={cn("field")}>
        <label htmlFor="count" className={cn("label")}>
          {props.labelCount} {props.title}
          {props.labelBuy}
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

      <button className={cn("submit")} type="submit">
        OK
      </button>
    </form>
  );
}

CountItemForm.propTypes = {
  title: PropTypes.string,
  labelCount: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default CountItemForm;
