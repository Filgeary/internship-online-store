import { memo, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import { TranslateFunc } from "@src/i18n/types";

interface CounterModalFormProps {
  minInputValue: number,
  maxInputValue: number,
  onSubmit: (count: number) => void,
  onCancel: () => void,
  t: TranslateFunc,
}

function CounterModalForm({ minInputValue, maxInputValue, t, ...props }: CounterModalFormProps) {
  const [count, setCount] = useState<number | string>(minInputValue);

  const callbacks = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (+e.target.value > maxInputValue) {
        setCount(maxInputValue);
      } else if (+e.target.value < 0) {
        setCount(minInputValue);
      } else {
        setCount(e.target.value);
      }
    },
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
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
            onClick={() => props.onSubmit(+count)}
          >
            Ок
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(CounterModalForm);
