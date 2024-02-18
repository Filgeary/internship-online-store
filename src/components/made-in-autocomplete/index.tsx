import { memo, useCallback } from "react"
import Autocomplete from "../autocomplete"
import { ContainerViewBuilder, FieldViewBuilderProps, Option, OptionsViewBuilder } from "../autocomplete/types"
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
    fieldViewBuilder: useCallback((props: FieldViewBuilderProps) => (
      <InputView {...props}/>
    ), []),

    optionsViewBuilder: useCallback((cProps: OptionsViewBuilder<MadeInOption>) => (
      <OptionsView {...cProps} selected={props.value}/>
    ), [props.options, props.value]),

    containerViewBuilder: useCallback((cProps: ContainerViewBuilder) => (
        <ButtonView {...cProps} value={props.value} multiple={props.multiple}/>
      ), [props.value]),

    optionsBuilder: useCallback((inputValue: string) =>  
      props.options.filter((option) => option.title.toLowerCase().includes(inputValue.trim().toLowerCase())
    ), [props.options])
  }

  if (props.multiple) {
    return  (
      <Autocomplete
        options={props.options}
        value={props.value}
        onSelected={props.onSelected}
        fieldViewBuilder={renders.fieldViewBuilder}
        optionsViewBuilder={renders.optionsViewBuilder}
        optionsBuilder={renders.optionsBuilder}
        containerViewBuilder={renders.containerViewBuilder}
        multiple={props.multiple}
        dropdownClassName={cn('dropdown')}
      />
    )
  }

  return (
    <Autocomplete
      options={props.options}
      value={props.value}
      onSelected={props.onSelected}
      fieldViewBuilder={renders.fieldViewBuilder}
      optionsViewBuilder={renders.optionsViewBuilder}
      optionsBuilder={renders.optionsBuilder}
      containerViewBuilder={renders.containerViewBuilder}
      dropdownClassName={cn('dropdown')}
    />
  )
}

export default memo(MadeInAutocomplete) as typeof MadeInAutocomplete