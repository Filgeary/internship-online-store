import { memo } from "react"
import {cn as bem} from '@bem-react/classname';
import type { ListElementViewBuilderProps } from "@src/components/autocomplete/types";
import type { MadeInOption } from "../types";
import './style.css'

type Props = ListElementViewBuilderProps<MadeInOption>

function ListElementView(props: Props) {
  const {selected, hovered, option} = props
  const cn = bem('ListElementView')

  return (
    <li 
        ref={props.listElementRef}
        onClick={props.onClickListElement}
        onMouseEnter={props.onMouseEnterListElement}
        className={cn({selected, hovered})}
    >
      <div className={cn("code")}>{option.code}</div>
      <span className={cn("title")}>{option.title}</span>
    </li>
  )
}

export default memo(ListElementView)