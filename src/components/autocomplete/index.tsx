import { memo, useCallback, useRef, useState, type MouseEvent } from "react";
import type { AutocompleteProps, Option } from "./types";
import {cn as bem} from '@bem-react/classname';
import List from "./list";
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

    onRemoveSelected: useCallback((e: MouseEvent<HTMLElement>, option: O) => {
      e.stopPropagation();
      props.onSelect(option)
    }, [props.onSelect])
  }
  
  return(
    <div className={cn()}>
      {props.buttonViewBuilder({
        toggleDropdown: callbacks.toggleDropdown,
        isDropdownCollapsed: isDropdownCollapsed,
        buttonRef: refs.button,
        onRemoveSelected: callbacks.onRemoveSelected as (e: MouseEvent<HTMLElement>, option: Option) => void
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
        {
          props.multiple
            ? (<List
              listElementViewBuilder={props.listElementViewBuilder}
              listViewBuilder={props.listViewBuilder}
              options={props.options}
              collapseDropdown={callbacks.collapseDropdown}
              refs={{
                dropdown: refs.dropdown,
                input: refs.input
              }}
              onSelect={props.onSelect as (option: Option) => void}
              optionsBuilder={props.optionsBuilder}
              multiple={props.multiple}
              value={props.value}
            />) : (<List
              listElementViewBuilder={props.listElementViewBuilder}
              listViewBuilder={props.listViewBuilder}
              options={props.options}
              collapseDropdown={callbacks.collapseDropdown}
              refs={{
                dropdown: refs.dropdown,
                input: refs.input
              }}
              onSelect={props.onSelect as (option: Option) => void}
              optionsBuilder={props.optionsBuilder}
              multiple={props.multiple}
              value={props.value}
            />)
        }
      </Dropdown>}
    </div>
  )
}

export default memo(Autocomplete) as typeof Autocomplete
