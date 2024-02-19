import { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutocompleteProps, Option } from "./types";
import {cn as bem} from '@bem-react/classname';
import './style.css'
import useAutocompleteScrollAdjustment from "./hooks/use-autocomplete-scroll-adjustment";
import useAutocompeteCollapseOnForeignAction from "./hooks/use-autocompete-collapse-on-foreign-action";
import useOnDropdownKeyDown from "./hooks/use-on-dropdown-key-down";

function Autocomplete<O extends Option>(props: AutocompleteProps<O>) {
  const cn = bem('AutoComplete');
  const [inputValue, setInputValue] = useState<string>('')
  const [isDropdownCollapsed, setDropdownCollapsed] = useState<boolean>(true)
  const [hoveredItem, setHoveredItem] = useState<{index: number, hovered: boolean} | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toggleDropdownButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listItemRef = useRef<HTMLLIElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const triggerMouseEnterRef = useRef<boolean>(true)

  const buildedOptions = useMemo(() => (
    props.optionsBuilder(inputValue)
  ), [inputValue, props.options])

  const callbacks = {
    onInput: useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      setHoveredItem({hovered: true, index: 0})
    }, []),

    onToggleDropdown: useCallback(() => setDropdownCollapsed(prev => !prev), []),

    onMouseEnterOption: useCallback((index: number) => {
      if (!triggerMouseEnterRef.current) return triggerMouseEnterRef.current = true;
      setHoveredItem({hovered: true, index})
    }, []),

    onMouseLeaveOption: useCallback(() => setHoveredItem(prev => (prev?.index || prev?.index === 0) ? ({...prev, hovered: false}) : null), []),

    onSelectOption: useCallback((option: O) => {
      if (!props.multiple && props.value?.value != option.value) {
        setDropdownCollapsed(true)
        toggleDropdownButtonRef?.current?.focus()
      }
      props.onSelected(option)
    }, [props.onSelected, props.value, props.multiple]),

    onKeyDown: useOnDropdownKeyDown({
      buildedOptions, hoveredItem, setDropdownCollapsed,
      setHoveredItem, toggleDropdownButtonRef, value: props.value,
      multiple: props.multiple, onSelected: props.onSelected
    }),
  }

  useAutocompleteScrollAdjustment({
    hoveredItem, itemRef: listItemRef, listRef, triggerMouseEnterRef
  })

  useEffect(() => {
    if (isDropdownCollapsed) return setHoveredItem(null);
    console.log(inputRef?.current)
    inputRef?.current?.focus()
  }, [isDropdownCollapsed])

  useAutocompeteCollapseOnForeignAction({
    dropdownRef, isDropdownCollapsed, setDropdownCollapsed, toggleDropdownButtonRef
  })
  
  
  return(
    <div className={cn()}>
      {props.containerViewBuilder({
        dropdownController: {
          onToggle: callbacks.onToggleDropdown,
          isCollapsed: isDropdownCollapsed
        },
        buttonRef: toggleDropdownButtonRef
      })}
      {!isDropdownCollapsed && <div
        tabIndex={-1} 
        onKeyDown={callbacks.onKeyDown} 
        className={props.dropdownClassName || cn('dropdown')} 
        ref={dropdownRef}
      >
        {props.fieldViewBuilder({
          inputController: {
            value: inputValue, onChange: callbacks.onInput 
          },
          inputRef,
        })}
        {props.optionsViewBuilder({
          hoverController: {
            item: hoveredItem,
            onMouseEnter: callbacks.onMouseEnterOption,
            onMouseLeave: callbacks.onMouseLeaveOption,
            itemRef: listItemRef,
            listRef,
          },
          optionsController: {
            onSelect: callbacks.onSelectOption,
            buildedOptions,
          },
        })}
      </div>}
    </div>
  )
}

export default memo(Autocomplete) as typeof Autocomplete
