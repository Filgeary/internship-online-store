import { memo, useState } from "react";
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import './style.css';

function ItemAdd(props) {
  const [value, setValue] = useState(props.initial);

  const cn = bem('ItemAdd');

  const callbacks = {
    setArticleValue: () => value > 0 && props.setCount(Number(value)),
    onChangeValue: (e) => setValue(e.currentTarget.value)
  }

  return (
    <div className={cn()}>
      <div className={cn("right")}>
        <input className={cn("cell")} type="number" min={1} value={value} onChange={callbacks.onChangeValue} />
        <div className={cn("cell")}>
          <button onClick={callbacks.setArticleValue}>{props.btnTitle}</button>
        </div>
      </div>
    </div>
  )
}

ItemAdd.propTypes = {
  initial: PropTypes.number,
  btnTitle: PropTypes.string,
  setCount: PropTypes.func,
}

ItemAdd.defaultProps = {
  setCount: () => {},
  initial: 0,
  btnTitle: ''
}

export default memo(ItemAdd);
