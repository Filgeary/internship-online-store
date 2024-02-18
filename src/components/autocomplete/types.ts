import { ChangeEvent, ReactElement, RefObject, KeyboardEvent } from "react"

export type Option = {
  title: string,
  value: string,
}

export type FieldViewBuilderProps = {
  textEditingController: {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
  },
  focusNode: RefObject<HTMLInputElement>,
  tabIndex: number
}

export type OptionsViewBuilder<O extends Option = Option> = {
  onSelected: (option: O) => void,
  onKeyUp: (e: KeyboardEvent<HTMLLIElement>, option: O) => void,
  filteredOptions: O[]
  liRef: RefObject<HTMLLIElement>
}

export type ContainerViewBuilder = {
  onToggle: () => void,
  tabIndex: number
  buttonRef: RefObject<HTMLButtonElement>,
  isCollapsed: boolean
}

type ViewProps<O extends Option> = {
  optionsBuilder: (inputValue: string) => O[],
  fieldViewBuilder: (props: FieldViewBuilderProps) => ReactElement,
  optionsViewBuilder: (props: OptionsViewBuilder<O>) => ReactElement
  containerViewBuilder: (props: ContainerViewBuilder) => ReactElement,
  dropdownClassName: string
}

type OptionsBaseProps<O extends Option> = {
  options: O[],
  onSelected: (option: O) => void,
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