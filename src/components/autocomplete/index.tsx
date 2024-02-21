import { memo, useCallback, useRef, useState } from "react";
import type { AutocompleteProps, Option } from "./types";
import {cn as bem} from '@bem-react/classname';
import Options from "./list";
import Input from "./input";
import Dropdown from "./dropdown";
import './style.css'

function Autocomplete<O extends Option>(props: AutocompleteProps<O>) {
  const cn = bem('AutoComplete');
  const [isDropdownCollapsed, setDropdownCollapsed] = useState<boolean>(true)

  const refs = {
    button: useRef<HTMLButtonElement>(null),
    dropdown: useRef<HTMLDivElement>(null),
    input: useRef<HTMLInputElement>(null),
  }

  const callbacks = {
    toggleDropdown: useCallback(() => setDropdownCollapsed(prev => !prev), []),

    collapseDropdown: useCallback((focusOnButton?: boolean) => {
      setDropdownCollapsed(true)
      focusOnButton && refs.button?.current?.focus()
    }, []),
  }
  
  return(
    <div className={cn()}>
      {props.buttonViewBuilder({
        toggleDropdown: callbacks.toggleDropdown,
        isDropdownCollapsed: isDropdownCollapsed,
        buttonRef: refs.button
      })}
      {!isDropdownCollapsed && <Dropdown 
        dropdownClassName={props.dropdownClassName}
        collapseDropdown={callbacks.collapseDropdown}
        refs={{
          button: refs.button,
          dropdown: refs.dropdown,
        }}
      >
        <Input
          inputViewBuilder={props.inputViewBuilder}
          inputRef={refs.input}
        />
        {/* @ts-ignore */}
        <Options
          listElementViewBuilder={props.listElementViewBuilder as any}
          listViewBuilder={props.listViewBuilder as any}
          options={props.options}
          collapseDropdown={callbacks.collapseDropdown}
          refs={{
            dropdown: refs.dropdown,
            input: refs.input
          }}
          onSelect={props.onSelect as any}
          optionsBuilder={props.optionsBuilder}
          multiple={props.multiple}
          value={props.value}
        />
      </Dropdown>}
    </div>
  )
}

export default memo(Autocomplete) as typeof Autocomplete
