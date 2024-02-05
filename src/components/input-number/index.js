import {memo} from "react";
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import Button from "@src/components/button";
import Input from "../input";
import './style.css';

function InputNumber(props) {
  const cn = bem('InputNumber');

  const callbacks = {
    increment: () => props.updateValue(String(Number(props.value) + 1)),
    decrement: () => props.updateValue(String(Number(props.value) - 1)),
  }

  return (
    <div className={cn()} onClick={e => e.stopPropagation()}>
      <div className={cn('cell')}>
        <Button
          value='-'
          size='nano'
          height='input'
          onClick={callbacks.decrement}
          disabled={props.value <= props.minValue}
        />
      </div>
      <div className={cn('cell')}>
        <Input
          value={String(props.value)}
          validation={'onlyNumber'}
          minWidth={String(props.minValue).length + 1}
          minValue={props.minValue}
          maxValue={props.maxValue}
          minDefaultValue={props.minValue}
          maxDefaultValue={props.maxValue}
          onChange={props.updateValue}
          placeholder={props.placeholder}
          theme={'nano'}
          stretch={true}
          autoFocus={true}
        />
      </div>
      <div className={cn('cell')}>
        <Button
          value='+'
          size='nano'
          height='input'
          onClick={callbacks.increment}
          disabled={props.value >= props.maxValue}
        />
      </div>
    </div>
  );
}

InputNumber.propTypes = {
  //sum: PropTypes.number,
  //t: PropTypes.func
};

InputNumber.defaultProps = {
  //sum: 0,
  //t: (text) => text
}

export default memo(InputNumber);
