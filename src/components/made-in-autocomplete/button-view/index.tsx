import { ContainerViewBuilder } from "@src/components/autocomplete/types";
import { memo } from "react";
import { MadeInOption } from "../types";
import {cn as bem} from '@bem-react/classname';
import './style.css'
import Arrow from "./arrow";

type Props = ContainerViewBuilder & {
  value: MadeInOption | MadeInOption[] | undefined,
  multiple: boolean | undefined
}

function ButtonView(props: Props) {
  const {dropdownController, buttonRef} = props
  const cn = bem('ButtonView')

  if (props.multiple && Array.isArray(props.value)) {
    return (
      <button className={cn()} onClick={dropdownController.onToggle} ref={buttonRef}>
        <div className={cn('info')}>
          {props.value.length > 1 
            ? props.value.map(option => <div className={cn('code')}>{option.code}</div>)
            : (
              <>
                <div className={cn('code')}>{props.value[0]?.code}</div>
                <span className={cn('title')}>{props.value[0]?.title || 'Все'}</span>
              </>
            )
          }
        </div>
        <Arrow className={cn('arrow', {
          rotated: dropdownController.isCollapsed
        })}/>
{/*         
        {
        props.value.length ?  props.value.map(option => option.title).join(',') : 'Все'
        } */}
      </button>
    ) 
  }

  return (
    <button className={cn()} onClick={dropdownController.onToggle} ref={buttonRef}>
      <div className={cn('info')}>
        <div className={cn('code')}>{(props.value as MadeInOption | undefined)?.code}</div>
        <span className={cn('title')}>{(props.value as MadeInOption | undefined)?.title || 'Все'}</span>
      </div>
      <Arrow className={cn('arrow', {
        rotated: dropdownController.isCollapsed
      })}/>
    </button>
  )
}

export default memo(ButtonView)