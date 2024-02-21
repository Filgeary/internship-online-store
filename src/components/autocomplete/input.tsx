import { memo, useCallback, useState, ChangeEvent, useRef, useEffect, Dispatch } from "react";
import { AutocompleteProps, Option } from "./types";

type BaseProps<O extends Option> = {
  inputViewBuilder: AutocompleteProps<O>['inputViewBuilder']
  dropHoveredItemToStart: () => void
  inputValue: string,
  setInputValue: Dispatch<React.SetStateAction<string>>
}

type Props<O extends Option> = BaseProps<O>

function Input<O extends Option>(props: Props<O>) {
  const {inputViewBuilder, dropHoveredItemToStart, inputValue, setInputValue} = props
  const inputRef = useRef<HTMLInputElement>(null)
  
  const callbacks = {
    onInput: useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      dropHoveredItemToStart()
    }, []),
  }

  useEffect(() => {
    inputRef?.current?.focus()
  })

  return inputViewBuilder({
    inputController: {
      value: inputValue, onChange: callbacks.onInput 
    },
    inputRef,
  })
}

export default memo(Input)