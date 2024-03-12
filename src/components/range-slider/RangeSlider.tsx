import { memo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import s from "./style.module.css";

type RangeSliderPropsType = {
  value: number;
  changeSliderValue: (value: number) => void
}

const RangeSlider = (props: RangeSliderPropsType) => {
  const callbacks = {
    changeValue: (value:number) => props.changeSliderValue(value),
  }

  return (
    <div className={s.Wrapper}>
      <Slider className={s.Slider}
        min={0} max={25} step={1}
        value={props.value}
        onChange={callbacks.changeValue}
      />
      <div>
        {props.value}
      </div>
    </div>
  );
};

export default memo(RangeSlider);
