import { RefObject, memo } from "react";
import { AutocompleteProps, Option } from "./types";

type Props<O extends Option> = {
  buttonViewBuilder: AutocompleteProps<O>['buttonViewBuilder']
  buttonRef: RefObject<HTMLButtonElement>
  toggleDropdown: () => void
  isDropdownCollapsed: boolean
}

function Button<O extends Option>(props: Props<O>) {
  const { buttonViewBuilder, buttonRef, toggleDropdown, isDropdownCollapsed } = props

  return buttonViewBuilder({
    dropdownController: {
      toggleDropdown,
      isCollapsed: isDropdownCollapsed
    },
    buttonRef
  })
}

export default memo(Button)