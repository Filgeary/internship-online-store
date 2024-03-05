import { useState, memo, ChangeEvent, FormEvent } from "react";
import { cn as bem } from "@bem-react/classname";
import type { CountItemFormProps } from "./type";
import './style.css';

function CountItemForm(props: CountItemFormProps) {
  const cn = bem("CountItemForm");
  const [count, setCount] = useState("1");

  const callbacks = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      let value = Number(e.target.value).toString().slice(0, 3);
      setCount(value);
    },
    onSubmit: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      props.onSubmit(count);
    },
  };

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

export default memo(CountItemForm);
