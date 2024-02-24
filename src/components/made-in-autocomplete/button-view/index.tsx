import type { ButtonViewBuilderProps } from "@src/components/autocomplete/types";
import { memo } from "react";
import type { MadeInOption } from "../types";
import {cn as bem} from '@bem-react/classname';
import Arrow from "./arrow";
import type { TranslateFn } from "@src/i18n/types";
import './style.css'

type Single<O extends MadeInOption> = {
  value: O | undefined,
  multiple?: never,
}

type Multiple<O extends MadeInOption> = {
  value: O[],
  multiple: true
}

type Props<O extends MadeInOption> = ButtonViewBuilderProps & (Single<O> | Multiple<O>)& {t: TranslateFn}

function ButtonView<O extends MadeInOption>(props: Props<O>) {
  const {value, multiple} = props
  const cn = bem('ButtonView')

  const render = {
    infoInner: multiple 
      ? value.length > 1 
        ? value.map(option => <div className={cn('code')} onClick={(e) => props.onRemoveSelected(e, option)}>{option.code}</div>)
        : <>
          <div className={cn('code')} onClick={(e) => props.onRemoveSelected(e, value[0])}>{value[0]?.code}</div>
          <span className={cn('title')}>{value[0]?.title || props.t('made-in-autocomplete.all')}</span>
        </>
      : <>
        <div className={cn('code')}>{value?.code}</div>
        <span className={cn('title')}>{value?.title || props.t('made-in-autocomplete.all')}</span>
      </>
  }

  return (
    <button className={cn()} onClick={props.toggleDropdown} ref={props.buttonRef}>
      <div className={cn('info')}>
        {render.infoInner}
      </div>
      <Arrow className={cn('arrow', {
        rotated: props.isDropdownCollapsed
      })}/>
    </button>
  )
}

export default memo(ButtonView)