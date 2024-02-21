import { memo, useCallback } from "react"
import Autocomplete from "../autocomplete"
import { ButtonViewBuilderProps, InputViewBuilderProps, ListElementViewBuilderProps, ListViewBuilderProps,  } from "../autocomplete/types"
import { MadeInOption, MadeInAutocompleteProps } from "./types"
import ListView from "./list-view";
import InputView from "./input-view";
import ButtonView from "./button-view";
import {cn as bem} from '@bem-react/classname';
import './style.css'
import ListElementView from "./list-element-view";
import useTranslate from "@src/hooks/use-translate";

function MadeInAutocomplete(
  props: MadeInAutocompleteProps
) {
  const cn = bem('MadeInAutocomplete')
  const {t} = useTranslate()

  const renders = {
    inputViewBuilder: useCallback((inputProps: InputViewBuilderProps) => (
      <InputView {...inputProps} t={t}/>
    ), [t]),

    listViewBuilder: useCallback((optionsProps: ListViewBuilderProps) => (
      <ListView {...optionsProps}/>
    ), [props.options, props.value]),

    listElementViewBuilder: useCallback((optionProps: ListElementViewBuilderProps<MadeInOption>) => (
      <ListElementView {...optionProps}/>
    ), [props.options, props.value]),

    buttonViewBuilder: useCallback((buttonProps: ButtonViewBuilderProps) => (
      <ButtonView {...buttonProps} value={props.value} multiple={props.multiple} t={t}/>
      ), [props.value, t]),

    optionsBuilder: useCallback((inputValue: string) => {
      return props.options.filter((option) => option.title.toLowerCase().includes(inputValue.trim().toLowerCase()))
    }, [props.options])
  }

  return (
    <Autocomplete
      options={props.options}
      value={props.value}
      onSelect={props.onSelect}
      inputViewBuilder={renders.inputViewBuilder}
      listViewBuilder={renders.listViewBuilder}
      listElementViewBuilder={renders.listElementViewBuilder}
      optionsBuilder={renders.optionsBuilder}
      buttonViewBuilder={renders.buttonViewBuilder}
      dropdownClassName={cn('dropdown')}
    />
  )
}

export default memo(MadeInAutocomplete) as typeof MadeInAutocomplete