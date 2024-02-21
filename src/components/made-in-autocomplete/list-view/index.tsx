import { memo } from "react"
import {cn as bem} from '@bem-react/classname';
import type { ListViewBuilderProps } from "@src/components/autocomplete/types";;
import './style.css'

type Props = ListViewBuilderProps

function ListView(props: Props) {
  const cn = bem('ListView')

  return (
    <ul className={cn()} 
        onMouseLeave={props.onMouseLeaveList}
        ref={props.listRef}
    >
      {props.children}
    </ul>
  )
}

export default memo(ListView)