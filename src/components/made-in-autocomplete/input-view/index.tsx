import { FieldViewBuilderProps } from "@src/components/autocomplete/types";
import { memo } from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css'

function InputView(props: FieldViewBuilderProps) {
  const {inputRef, inputController} = props
  const cn = bem('InputView')

  return (
    <input value={inputController.value}
      onChange={inputController.onChange}
      ref={inputRef}
      placeholder="Поиск"
      className={cn()}/>
  )
}

export default memo(InputView)