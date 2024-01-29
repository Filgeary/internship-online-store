import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import './style.css';

function NumberInput(props) {

  const cn = bem('NumberInput');

  const callbacks = {
    onIncrement: useCallback(() => props.setValue(prev => ++prev), [props.setValue]),
    onDecrement: useCallback(() => props.setValue(prev => --prev), [props.setValue]),
    onChange: useCallback((e) => {
      let value = e.target.value
      if (value > props.max) {
        value = props.max
      } else if (value < props.min) {
        value = props.min
      }
      props.setValue(Number(value))
    }, [props.setValue, props.max, props.min])
  }

  return (
    <div className={cn()}>
      <button className={cn('button')}
              onClick={callbacks.onDecrement}
              disabled={props.value <= props.min}>-</button>
      <input 
        className={cn('input')} 
        type="number" 
        value={props.value} 
        onChange={callbacks.onChange}
        min={props.min}
        step={props.step}
        max={props.max}/>
      <button className={cn('button')}
              onClick={callbacks.onIncrement}
              disabled={props.value >= props.max}>+</button>
    </div>
  )
}

NumberInput.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

NumberInput.defaultProps = {
  setValue: () => {
  },
  value: 0
};

export default memo(NumberInput)