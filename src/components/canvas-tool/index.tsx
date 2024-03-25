import { memo, useState } from "react";
import s from "./style.module.css";
import { CanvasAction } from "../../containers/canvas-layout";
import { SketchPicker } from "react-color";
import RangeSlider from "../range-slider/RangeSlider";

type CanvasToolPropsType = {
  currentAction: CanvasAction;
  changeActionType: (type: CanvasAction) => void;
};

function CanvasTool(props: CanvasToolPropsType) {
  const [color, setColor] = useState(props.currentAction.color || "#000");
  const [isPicker, setIsPicker] = useState(false);
  const [sliderValue, setSliderValue] = useState(props.currentAction.lineWidth);

  const callbacks = {
    show: () => props.changeActionType({...props.currentAction, type: "show"}),
    falling: () => props.changeActionType({...props.currentAction, type: "fall"}),
    clearCanvas: () =>
      props.changeActionType({ ...props.currentAction, type: "clear" }),
    drawTriangle: () =>
      props.changeActionType({ ...props.currentAction, type: "triangle" }),
    drawSquare: () =>
      props.changeActionType({ ...props.currentAction, type: "square" }),
    drawCircle: () =>
      props.changeActionType({ ...props.currentAction, type: "circle" }),
    drawLine: () =>
      props.changeActionType({ ...props.currentAction, type: "line" }),
    setColor: (color: any) => {
      setColor(color.hex);
      props.changeActionType({ ...props.currentAction, color: color.hex });
    },
    changePicker: () => setIsPicker(!isPicker),
    changeSliderValue: (value: number) => {
      setSliderValue(value);
      props.changeActionType({...props.currentAction, lineWidth: value })
    }
  };

  return (
    <div className={s.Tools}>
      <div className={s.Wrapper}>
        <button onClick={callbacks.drawTriangle}>Треугольник</button>
        <button onClick={callbacks.drawSquare}>Квадрат</button>
        <button onClick={callbacks.drawCircle}>Круг</button>
        <button onClick={callbacks.drawLine}>Линия</button>
        <button onClick={callbacks.falling}>Падение</button>
        <button onClick={callbacks.clearCanvas}>Очистить</button>
        <button onClick={callbacks.show}>Вечеринка</button>
      </div>
      <div className={s.Wrapper}>
        <button onClick={callbacks.changePicker} className={s.ColorButton}>
          <div>Цвет</div>
          <div
            className={s.ColorExample}
            style={{ backgroundColor: `${color}` }}
          ></div>
        </button>
        {isPicker && (
          <SketchPicker
            color={color}
            onChange={callbacks.setColor}
            className={s.ColorPicker}
          />
        )}
        {props.currentAction.type === "line" &&
        <RangeSlider value={sliderValue} changeSliderValue={callbacks.changeSliderValue} />}
      </div>
    </div>
  );
}

export default memo(CanvasTool);
