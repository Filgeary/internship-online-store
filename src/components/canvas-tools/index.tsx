import { memo, useCallback } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import Figure from "@src/containers/draw-canvas/figures";

interface ICanvasTools {
  figures: { render: React.ReactNode; value: Figure }[];
  lines: { value: number; title: string }[];
  color: string;
  figureName: string;
  lineWidth: number;
  changeLineWidth: (data: number) => void;
  changeColor: (data: string) => void;
  changeFigure: (data: Figure) => void;
  setIsFill: (data: boolean) => void;
}

function CanvasTools(props: ICanvasTools) {
  const cn = bem("CanvasTools");

  const callbacks = {
    onChangeColor: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        props.changeColor(e.target.value);
    },
    []),
    onChangeFigure: useCallback((value: Figure) => {
        props.changeFigure(value);
    }, []),
    onChangeFill: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        props.setIsFill(e.target.checked);
    }, []),
    onChangeLineWidth: useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        props.changeLineWidth(Number(e.target.value))
    }, []),
  };

  return (
    <div className={cn()}>
      <input
        type="color"
        defaultValue={props.color}
        onChange={callbacks.onChangeColor}
      />
      {props.figures.map((item, index) => (
        <button
          key={index}
          onClick={() => callbacks.onChangeFigure(item.value)}
          className={cn("figure", {active: item.value.name == props.figureName})}
        >
          {item.render}
        </button>
      ))}
      <select defaultValue={props.lineWidth} onChange={callbacks.onChangeLineWidth}>
        {props.lines.map((line) => (
            <option key={line.value} value={line.value}>{line.title}</option>
        ))}
      </select>
      <div className={cn("checkbox")}>
        <input type="checkbox" onChange={callbacks.onChangeFill}/> Заливка
      </div>
    </div>
  );
}

export default memo(CanvasTools);
