import { memo, useCallback, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

type TCountFormProps = {
  onSubmit: (number: number) => void;
  closeModal: any;
  basketUnit: string;
  title: string;
  ok: string;
  cancel: string;
};
function CountForm(props: TCountFormProps) {
  const cn = bem("CountForm");
  const [count, setCount] = useState(0);

  const callbacks = {
    onChange: useCallback(
      (e: { target: { value: string } }) => {
        setCount(parseInt(e.target.value));
      },
      [count]
    ),

    onSubmit: (e: { preventDefault: () => void }) => {
      e.preventDefault();
      props.onSubmit(count);
    },

    closeModal: () => {
      props.closeModal();
    },
  };

  return (
    <form onSubmit={callbacks.onSubmit} className={cn()}>
      <div className={cn("frame")}>
        <h3>
          {props.title} (1-99), {props.basketUnit}:
        </h3>
        <div className={cn("btn")}>
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

          <button type="submit">{props.ok}</button>
        </div>
      </div>
    </form>
  );
}

/* CountForm.defaultProps = {
  onSubmit: () => {},
  closeModal: () => {},
  basketUnit: "шт",
  title: "Введите количество товара",
  ok: "Ок",
  cancel: "Отмена",
}; */

export default memo(CountForm);
