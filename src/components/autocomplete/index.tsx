import { KeyboardEvent, memo, useCallback, useMemo, useRef, useState } from "react";
import { AutocompleteProps, Option } from "./types";
import {cn as bem} from '@bem-react/classname';
import './style.css'
import Options from "./options";
import Input from "./input";
import Dropdown from "./dropdown";
import Button from "./button";

function Autocomplete<O extends Option>(props: AutocompleteProps<O>) {
  const cn = bem('AutoComplete');
  const [inputValue, setInputValue] = useState<string>('')
  const [isDropdownCollapsed, setDropdownCollapsed] = useState<boolean>(true)
  const [hoveredItem, setHoveredItem] = useState<{index: number, hovered: boolean} | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRef = useRef<HTMLLIElement>(null)
  
  const buildedOptions = useMemo(() => (
    props.optionsBuilder(inputValue)
  ), [inputValue, props.options])

  const callbacks = {

    toggleDropdown: useCallback(() => setDropdownCollapsed(prev => !prev), []),

    dropHoveredItemToStart: useCallback(() => setHoveredItem({hovered: true, index: 0}), []),

    collapseDropdownAndFocusOnButton: useCallback(() => {
      setDropdownCollapsed(true)
      setHoveredItem(null)
      buttonRef?.current?.focus()
    }, []),

    collapseDropdown: useCallback(() => {
      setHoveredItem(null)
      setDropdownCollapsed(true)
    }, []),

    onDropdownKeyDown: useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "Enter": 
          e.preventDefault()
          if (!hoveredItem) break
          const founded = buildedOptions.find((_, i) => i === hoveredItem?.index)
          if (!founded) break
          if (!props.multiple && (props.value as O | undefined)?.value != founded.value) {
            callbacks.collapseDropdownAndFocusOnButton()
          }
          props.onSelect(founded)
          break
        case "ArrowDown":
          e.preventDefault()
          if (hoveredItem && buildedOptions.length > (hoveredItem.index + 1)) {
            console.log(itemRef?.current)
            itemRef?.current?.nextElementSibling?.scrollIntoView({behavior: 'instant', block: 'center'})
            setHoveredItem({ index: hoveredItem.index + 1, hovered: true})
            
          } else if (!hoveredItem) {
            callbacks.dropHoveredItemToStart()
          }
          break;
        case "ArrowUp":
          e.preventDefault()
          if (hoveredItem && (hoveredItem.index - 1) >= 0 ) {
            setHoveredItem({index: hoveredItem.index - 1, hovered: true})
            itemRef?.current?.previousElementSibling?.scrollIntoView({behavior: 'instant', block: 'center'})
          } else if (!hoveredItem) {
            callbacks.dropHoveredItemToStart()
          }
          break;
        case "Escape":
          e.preventDefault()
          callbacks.collapseDropdownAndFocusOnButton()
          break;
      }
    }, [buildedOptions, hoveredItem, props.multiple, props.value, props.onSelect])
  }
  
  return(
    <div className={cn()}>
      <Button
        buttonRef={buttonRef}
        buttonViewBuilder={props.buttonViewBuilder}
        isDropdownCollapsed={isDropdownCollapsed}
        toggleDropdown={callbacks.toggleDropdown}
      />
      {!isDropdownCollapsed && <Dropdown 
        dropdownClassName={props.dropdownClassName || cn('dropdown')}
        onKeyDown={callbacks.onDropdownKeyDown}
        collapseDropdown={callbacks.collapseDropdown}
        collapseDropdownAndFocusOnButton={callbacks.collapseDropdownAndFocusOnButton}
        buttonRef={buttonRef}
      >
        <Input
          inputViewBuilder={props.inputViewBuilder}
          inputValue={inputValue}
          dropHoveredItemToStart={callbacks.dropHoveredItemToStart}
          setInputValue={setInputValue}
        />
        {/* @ts-ignore */}
        <Options
          buildedOptions={buildedOptions}
          hoveredItem={hoveredItem}
          collapseDropdownAndFocusOnButton={callbacks.collapseDropdownAndFocusOnButton}
          onSelect={props.onSelect as any}
          optionsViewBuilder={props.optionsViewBuilder as any}
          setHoveredItem={setHoveredItem}
          multiple={props.multiple}
          value={props.value}
          itemRef={itemRef}
        />
      </Dropdown>}
    </div>
  )
}

export default memo(Autocomplete) as typeof Autocomplete
