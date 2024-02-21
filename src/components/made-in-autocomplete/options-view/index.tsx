import { memo } from "react"
import {cn as bem} from '@bem-react/classname';
import './style.css'
import { OptionsViewBuilderProps } from "@src/components/autocomplete/types";
import { MadeInOption } from "../types";

type Props = OptionsViewBuilderProps<MadeInOption> & {
  selected: MadeInOption | MadeInOption[] | undefined,
}

function OptionsView(props: Props) {
  const {hoverController, optionsController} = props
  const cn = bem('OptionsView')

  return (
    <ul className={cn()} 
        onMouseLeave={hoverController.onMouseLeaveList}
        ref={hoverController.listRef}
    >
      {optionsController.buildedOptions.map((option,i) => (
        <li key={option.value} 
            ref={props.hoverController.item?.index === i ? hoverController.itemRef : undefined}
            onClick={() => optionsController.onSelect(option)}
            onMouseEnter={() => hoverController.onMouseEnterOption(i)}
            className={cn('li', {
              selected: Array.isArray(props.selected) 
                ? Boolean(props.selected.find(op => op.value === option.value))
                : (props.selected?.value === option.value),
              hovered: hoverController.item?.index === i && hoverController.item?.hovered
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