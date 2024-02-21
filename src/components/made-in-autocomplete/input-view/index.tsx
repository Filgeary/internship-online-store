import type { InputViewBuilderProps } from "@src/components/autocomplete/types";
import { memo } from "react";
import {cn as bem} from '@bem-react/classname';
import type { TranslateFn } from "@src/i18n/types";
import './style.css'

function InputView(props: InputViewBuilderProps & {t: TranslateFn}) {
  const cn = bem('InputView')

  return (
    <input
      ref={props.inputRef}
      placeholder={props.t('made-in-autocomplete.search')}
      className={cn()}/>
  )
}

export default memo(InputView)