import { memo, useCallback, useState, ChangeEvent, useRef, useEffect, Dispatch, RefObject } from "react";
import { AutocompleteProps, Option } from "./types";

type BaseProps<O extends Option> = {
  inputViewBuilder: AutocompleteProps<O>['inputViewBuilder']
  inputRef: RefObject<HTMLInputElement>
}

type Props<O extends Option> = BaseProps<O>

function Input<O extends Option>(props: Props<O>) {
  const {inputViewBuilder, inputRef} = props

  useEffect(() => {
    inputRef?.current?.focus()
  })

  return inputViewBuilder({
    inputRef,
  })
}

export default memo(Input)