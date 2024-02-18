import { FieldViewBuilderProps } from "@src/components/autocomplete/types";
import { memo } from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css'

function InputView(props: FieldViewBuilderProps) {
  const cn = bem('InputView')

  return (
    <input value={props.textEditingController.value}
      onChange={props.textEditingController.onChange}
      ref={props.focusNode}
      tabIndex={props.tabIndex}
      placeholder="Поиск"
      className={cn()}/>
  )
}

export default memo(InputView)