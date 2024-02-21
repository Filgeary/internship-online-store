import { ChangeEvent, ReactElement, RefObject, KeyboardEvent } from "react"

export type Option = {
  title: string,
  value: string,
}

export type InputViewBuilderProps = {
  inputRef: RefObject<HTMLInputElement>,
}

export type OptionsViewBuilderProps<O extends Option = Option> = {
  hoverController: {
    item: {index: number, hovered: boolean} | null
    onMouseEnterOption: (optionIndex: number) => void
    onMouseLeaveList: () => void
    itemRef: RefObject<HTMLLIElement>,
    listRef: RefObject<HTMLUListElement>
  }
  optionsController: {
    onSelect: (option: O) => void,
    buildedOptions: O[]
  }
}

export type ButtonViewBuilderProps = {
  dropdownController: {
    toggleDropdown: () => void,
    isCollapsed: boolean
  }
  buttonRef: RefObject<HTMLButtonElement>,
}

type ViewProps<O extends Option> = {
  optionsBuilder: (inputValue: string) => O[],
  inputViewBuilder: (props: InputViewBuilderProps) => ReactElement,
  optionsViewBuilder: (props: OptionsViewBuilderProps<O>) => ReactElement
  buttonViewBuilder: (props: ButtonViewBuilderProps) => ReactElement,
  dropdownClassName: string
}

type OptionsBaseProps<O extends Option> = {
  options: O[],
  onSelect: (option: O) => void,
}

type SingleOptionProps<O extends Option> = OptionsBaseProps<O> & {
  value: O | undefined,
  multiple?: never,
  
}

type MultipleOptionsProps<O extends Option> = OptionsBaseProps<O> & {
  value: O[],
  multiple: true
}

export type OptionsProps<O extends Option> = SingleOptionProps<O> | MultipleOptionsProps<O>

export type AutocompleteProps<O extends Option> = OptionsProps<O> & ViewProps<O>