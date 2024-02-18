import { memo } from "react"
import {cn as bem} from '@bem-react/classname';
import './style.css'
import { OptionsViewBuilder } from "@src/components/autocomplete/types";
import { MadeInOption } from "../types";

function OptionsView(props: OptionsViewBuilder<MadeInOption> & {
  selected: MadeInOption | MadeInOption[] | undefined
}) {
  const cn = bem('OptionsView')

  return (
    <ul className={cn()}>
      {props.filteredOptions.map((option,i) => (
        <li key={option.value} 
            ref={i === 0 ? props.liRef : undefined}
            onClick={() => props.onSelected(option)}
            onKeyUp={(e) => props.onKeyUp(e, option)}
            tabIndex={0}
            className={cn('li', {
              selected: Array.isArray(props.selected) 
                ? Boolean(props.selected.find(op => op.value === option.value))
                : (props.selected?.value === option.value)
            })}
        >
          <div className={cn("code")}>{option.code}</div>
          <span className={cn("title")}>{option.title}</span>
        </li>
      ))}
    </ul>
  )
}

export default memo(OptionsView)