import type { ReactElement, RefObject, ReactNode, MouseEvent } from "react"

export type Option = {
  title: string,
  value: string,
}

export type InputViewBuilderProps = {
  inputRef: RefObject<HTMLInputElement>,
}

export type ListViewBuilderProps = {
  onMouseLeaveList: () => void
  listRef: RefObject<HTMLUListElement>
  children: ReactNode | ReactNode[]
}

export type ListElementViewBuilderProps<O extends Option = Option> = {
  option: O
  onClickListElement: () => void,
  onMouseEnterListElement: () => void
  hovered: boolean
  selected: boolean
  listElementRef: RefObject<HTMLLIElement> | undefined
}

export type ButtonViewBuilderProps<O extends Option = Option> = {
  toggleDropdown: () => void,
  isDropdownCollapsed: boolean
  buttonRef: RefObject<HTMLButtonElement>,
  onRemoveSelected: (e: MouseEvent<HTMLElement>, option: O) => void
}

type ViewProps<O extends Option> = {
  optionsBuilder: (inputValue: string) => O[],
  inputViewBuilder: (props: InputViewBuilderProps) => ReactElement,
  listViewBuilder: (props: ListViewBuilderProps) => ReactElement
  listElementViewBuilder: (props: ListElementViewBuilderProps) => ReactElement
  buttonViewBuilder: (props: ButtonViewBuilderProps) => ReactElement,
  dropdownClassName: string
}

type OptionsBaseProps<O extends Option> = {
  options: O[],
  onSelect: (option: O) => void,
}

type SingleOptionProps<O extends Option> = {
  value: O | undefined,
  multiple?: never,
}

type MultipleOptionsProps<O extends Option> = {
  value: O[],
  multiple: true
}

export type OptionsProps<O extends Option> = OptionsBaseProps<O> & (SingleOptionProps<O> | MultipleOptionsProps<O>)

export type AutocompleteProps<O extends Option> = OptionsProps<O> & ViewProps<O>




