import { memo, useCallback } from "react"
import Autocomplete from "../autocomplete"
import { ButtonViewBuilderProps, InputViewBuilderProps, OptionsViewBuilderProps } from "../autocomplete/types"
import { MadeInOption, MadeInAutocompleteProps } from "./types"
import OptionsView from "./options-view";
import InputView from "./input-view";
import ButtonView from "./button-view";
import {cn as bem} from '@bem-react/classname';
import './style.css'

function MadeInAutocomplete(
  props: MadeInAutocompleteProps
) {

  const cn = bem('MadeInAutocomplete')

  const renders = {
    inputViewBuilder: useCallback((inputProps: InputViewBuilderProps) => (
      <InputView {...inputProps}/>
    ), []),

    optionsViewBuilder: useCallback((optionsProps: OptionsViewBuilderProps<MadeInOption>) => (
      <OptionsView {...optionsProps} selected={props.value}/>
    ), [props.options, props.value]),

    buttonViewBuilder: useCallback((buttonProps: ButtonViewBuilderProps) => (
        <ButtonView {...buttonProps} value={props.value} multiple={props.multiple}/>
      ), [props.value]),

    optionsBuilder: useCallback((inputValue: string) => {
      return props.options.filter((option) => option.title.toLowerCase().includes(inputValue.trim().toLowerCase()))
    }, [props.options])
  }

  if (props.multiple) {
    return  (
      <Autocomplete
        options={props.options}
        value={props.value}
        onSelect={props.onSelect}
        inputViewBuilder={renders.inputViewBuilder}
        optionsViewBuilder={renders.optionsViewBuilder}
        optionsBuilder={renders.optionsBuilder}
        buttonViewBuilder={renders.buttonViewBuilder}
        multiple={props.multiple}
        dropdownClassName={cn('dropdown')}
      />
    )
  }

  return (
    <Autocomplete
      options={props.options}
      value={props.value}
      onSelect={props.onSelect}
      inputViewBuilder={renders.inputViewBuilder}
      optionsViewBuilder={renders.optionsViewBuilder}
      optionsBuilder={renders.optionsBuilder}
      buttonViewBuilder={renders.buttonViewBuilder}
      dropdownClassName={cn('dropdown')}
    />
  )
}

export default memo(MadeInAutocomplete) as typeof MadeInAutocomplete