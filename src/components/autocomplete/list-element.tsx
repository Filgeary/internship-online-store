import { type RefObject, memo, useCallback } from "react";
import type { AutocompleteProps, Option } from "./types";

type SingleValue<O extends Option> = {
  value: O | undefined
  multiple?: never
}

type MultipleValue<O extends Option> = {
  value: O[]
  multiple: true
}

type BaseProps<O extends Option> = {
  option: O
  index: number
  hovered: boolean
  listElementRef: RefObject<HTMLLIElement> | undefined, 
  listElementViewBuilder: AutocompleteProps<O>['listElementViewBuilder']
  onSelect: (option: O) => void,
  onMouseEnterListElement: (index: number) => void
}

type Props<O extends Option> = BaseProps<O> & (SingleValue<O> | MultipleValue<O>)

function ListElement<O extends Option>(props: Props<O>) {

  const callbacks = {
    onMouseEnterListElement: useCallback(() => props.onMouseEnterListElement(props.index), [props.index, props.onMouseEnterListElement]),

    onClickListElement: useCallback(() => props.onSelect(props.option), [props.option,  props.onSelect]),
  }

  const render = {
    selected: Array.isArray(props.value)
      ? Boolean(props.value.find(selectedOption => selectedOption.value === props.option.value))
      : props.value?.value === props.option.value,
  }

  return props.listElementViewBuilder({
    option: props.option,
    hovered: props.hovered,
    listElementRef: props.listElementRef,
    selected: render.selected,
    onMouseEnterListElement: callbacks.onMouseEnterListElement,
    onClickListElement: callbacks.onClickListElement,
  })
}

export default memo(ListElement)