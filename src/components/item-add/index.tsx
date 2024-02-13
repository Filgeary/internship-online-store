import { ChangeEvent, memo, useState } from "react";
import {cn as bem} from "@bem-react/classname";
import { ItemAddPropsType } from "./types";
import './style.css';

function ItemAdd(props: ItemAddPropsType) {
  const [value, setValue] = useState<string | number>(props.initial);

  const cn = bem('ItemAdd');

  const callbacks = {
    setArticleValue: () => Number(value) > 0 && props.setCount(Number(value)),
    onChangeValue: (e: ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)
  }

  return (
    <div className={cn()}>
      <div className={cn('title')}>
        {props.title}
      </div>
      <div className={cn("right")}>
        <input className={cn("cell")} type="number" min={1} value={value} onChange={callbacks.onChangeValue} />
        <div className={cn("cell")}>
          <button onClick={callbacks.setArticleValue}>{props.btnTitle}</button>
        </div>
      </div>
    </div>
  )
}

// ItemAdd.defaultProps = {
//   setCount: () => {},
//   initial: 0,
//   btnTitle: ''
// }

export default memo(ItemAdd);
