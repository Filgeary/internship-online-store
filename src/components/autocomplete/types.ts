import { ChangeEvent, ReactElement, RefObject, KeyboardEvent } from "react"

export type Option = {
  title: string,
  value: string,
}

export type FieldViewBuilderProps = {
  inputController: {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
  },
  inputRef: RefObject<HTMLInputElement>,
}

export type OptionsViewBuilder<O extends Option = Option> = {
  hoverController: {
    item: {index: number, hovered: boolean} | null
    onMouseEnter: (index: number) => void
    onMouseLeave: () => void
    itemRef: RefObject<HTMLLIElement>,
    listRef: RefObject<HTMLUListElement>
  }
  optionsController: {
    onSelect: (option: O) => void,
    buildedOptions: O[]
  }
}

export type ContainerViewBuilder = {
  dropdownController: {
    onToggle: () => void,
    isCollapsed: boolean
  }
  buttonRef: RefObject<HTMLButtonElement>,
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