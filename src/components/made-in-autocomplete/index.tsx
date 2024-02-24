import { memo, useCallback } from "react"
import Autocomplete from "../autocomplete"
import { ButtonViewBuilderProps, InputViewBuilderProps, ListElementViewBuilderProps, ListViewBuilderProps, Option,  } from "../autocomplete/types"
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

    buttonViewBuilder: useCallback((buttonProps: ButtonViewBuilderProps<MadeInOption>) => props.multiple ? (
      <ButtonView {...buttonProps} 
        onRemoveSelected={buttonProps.onRemoveSelected as (e: React.MouseEvent<HTMLElement, MouseEvent>, option: Option) => void} 
        value={props.value} 
        multiple={props.multiple} t={t}/>
      ) : (
        <ButtonView {...buttonProps} 
          onRemoveSelected={buttonProps.onRemoveSelected as (e: React.MouseEvent<HTMLElement, MouseEvent>, option: Option) => void} 
          value={props.value} 
          multiple={props.multiple} t={t}/>
      ), [props.value, t]),

    optionsBuilder: useCallback((inputValue: string) => {
      return props.options.filter((option) => option.title.toLowerCase().includes(inputValue.trim().toLowerCase()))
    }, [props.options])
  }

  if (props.multiple) {
    return (
      <Autocomplete
        options={props.options}
        value={props.value}
        onSelect={props.onSelect}
        inputViewBuilder={renders.inputViewBuilder}
        listViewBuilder={renders.listViewBuilder}
        listElementViewBuilder={renders.listElementViewBuilder as (optionProps: ListElementViewBuilderProps<Option>) => JSX.Element}
        optionsBuilder={renders.optionsBuilder}
        buttonViewBuilder={renders.buttonViewBuilder}
        dropdownClassName={cn('dropdown')}
        multiple={props.multiple}
      />
    )
  }

  return (
    <Autocomplete
      options={props.options}
      value={props.value}
      onSelect={props.onSelect}
      inputViewBuilder={renders.inputViewBuilder}
      listViewBuilder={renders.listViewBuilder}
      listElementViewBuilder={renders.listElementViewBuilder as (optionProps: ListElementViewBuilderProps<Option>) => JSX.Element}
      optionsBuilder={renders.optionsBuilder}
      buttonViewBuilder={renders.buttonViewBuilder}
      dropdownClassName={cn('dropdown')}
      multiple={props.multiple}
    />
  )
}

export default memo(MadeInAutocomplete) as typeof MadeInAutocomplete