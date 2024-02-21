import { KeyboardEvent, memo, useCallback, useMemo, useRef, useState } from "react";
import { AutocompleteProps, Option } from "./types";
import {cn as bem} from '@bem-react/classname';
import './style.css'
import Options from "./options";
import Input from "./input";
import Dropdown from "./dropdown";

function Autocomplete<O extends Option>(props: AutocompleteProps<O>) {
  const cn = bem('AutoComplete');
  const [isDropdownCollapsed, setDropdownCollapsed] = useState<boolean>(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)


  const callbacks = {
    toggleDropdown: useCallback(() => setDropdownCollapsed(prev => !prev), []),

    collapseDropdown: useCallback((focusOnButton?: boolean) => {
      setDropdownCollapsed(true)
      focusOnButton && buttonRef?.current?.focus()
    }, []),
  }
  
  return(
    <div className={cn()}>
      {props.buttonViewBuilder({
        dropdownController: {
          toggleDropdown: callbacks.toggleDropdown,
          isCollapsed: isDropdownCollapsed
        },
        buttonRef
      })}
      {!isDropdownCollapsed && <Dropdown 
        dropdownClassName={props.dropdownClassName || cn('dropdown')}
        collapseDropdown={callbacks.collapseDropdown}
        refs={{
          buttonRef:buttonRef,
          dropdownRef:dropdownRef
        }}
      >
        <Input
          inputViewBuilder={props.inputViewBuilder}
          inputRef={inputRef}
        />
        {/* @ts-ignore */}
        <Options
          optionsViewBuilder={props.optionsViewBuilder as any}
          options={props.options}
          collapseDropdown={callbacks.collapseDropdown}
          dropdownRef={dropdownRef}
          inputRef={inputRef}
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
