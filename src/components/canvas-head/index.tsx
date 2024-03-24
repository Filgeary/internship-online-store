import { memo, useRef } from "react";
import { Clear, TrendingDown, VerticalAlignBottom } from "@mui/icons-material";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

type TCanvasHeadProps = {
  setCount: (count: number) => void;
  count: number;
};

const CanvasHead = ({ setCount, count }: TCanvasHeadProps) => {
  const cn = bem("CanvasHead");
  const handleClickClear = () => {
    const inputCount = document.getElementById(
      "inputCount"
    ) as HTMLInputElement | null;
    if (inputCount != null) {
      inputCount.value = "";
    }
    setCount(0);
  };
  return (
    <div className={cn()}>
      <span>
        {"Введите количество фигур:"}
        <input
          id="inputCount"
          type="number"
          step="1"
          placeholder="1-99999"
          value={count > 0 ? count : ""}
          min={1}
          max={99999}
          onChange={(e) => {
            setCount(Number(e.target.value));
          }}
          className={cn("input")}
        />
      </span>
      <span className={cn("item")} onClick={() => handleClickClear()}>
        <Clear color="disabled" fontSize="large" />
      </span>
    </div>
  );
};

export default memo(CanvasHead);
