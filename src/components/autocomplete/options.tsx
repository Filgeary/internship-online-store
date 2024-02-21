import { ChangeEvent, Dispatch, RefObject, memo, useCallback, useEffect, useRef, useState } from "react";
import { AutocompleteProps, Option } from "./types";
import useAutocompleteScrollAdjustment from "./hooks/use-autocomplete-scroll-adjustment";

type BaseProps<O extends Option> = {
  optionsViewBuilder: AutocompleteProps<O>['optionsViewBuilder']
  options: O[]
  collapseDropdown: (focusOnButton?: boolean) => void
  onSelect: (option: O) => void,
  dropdownRef: RefObject<HTMLDivElement>
  inputRef: RefObject<HTMLInputElement>
  optionsBuilder: (inputValue: string) => O[]
}

type Multiple<O extends Option> = {
  value: O[]
  multiple: true,
}

type Single<O extends Option> = {
  value: O | undefined,
  multiple?: never,
}

type Props<O extends Option> = BaseProps<O> & (Multiple<O> | Single<O>)

function Options<O extends Option>(props: Props<O>) {
  const {dropdownRef,optionsViewBuilder, optionsBuilder, inputRef, options, multiple, value, onSelect, collapseDropdown} = props

  const triggerMouseEnterRef = useRef<boolean>(true)
  const [hoveredItem, setHoveredItem] = useState<{index: number, hovered: boolean} | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const itemRef = useRef<HTMLLIElement>(null)
  const [buildedOptions, setBuildedOptions] = useState<O[]>(options)

  const callbacks = {
    onMouseEnterOption: useCallback((index: number) => {
      if (!triggerMouseEnterRef.current) return triggerMouseEnterRef.current = true;
      setHoveredItem({hovered: true, index})
    }, []),

    onMouseLeaveList: useCallback(() => setHoveredItem(prev => (prev?.index || prev?.index === 0) ? ({...prev, hovered: false}) : null), []),

    onSelect: useCallback((option: O) => {
      if (!multiple && value?.value != option.value) {
        collapseDropdown(true)
      }
      onSelect(option)
    }, [onSelect, value, multiple]),

    dropHoveredItemToStart: useCallback(() => setHoveredItem({hovered: true, index: 0}), []),

    dropHoveredItemToNull: useCallback(() => setHoveredItem(null), []),
  }

  useEffect(() => {
    function onDropdownKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Enter": 
          e.preventDefault()
          if (!hoveredItem) break
          const founded = buildedOptions.find((_, i) => i === hoveredItem?.index)
          if (!founded) break
          if (!props.multiple && (props.value as O | undefined)?.value != founded.value) {
            collapseDropdown(true)
          }
          props.onSelect(founded)
          break
        case "ArrowDown":
          e.preventDefault()
          if (hoveredItem && buildedOptions.length > (hoveredItem.index + 1)) {
            triggerMouseEnterRef.current = false
            itemRef?.current?.nextElementSibling?.scrollIntoView({behavior: 'instant', block: 'center'})
            setHoveredItem({ index: hoveredItem.index + 1, hovered: true})
            
          } else if (!hoveredItem) {
            callbacks.dropHoveredItemToStart()
          }
          break;
        case "ArrowUp":
          e.preventDefault()
          if (hoveredItem && (hoveredItem.index - 1) >= 0 ) {
            triggerMouseEnterRef.current = false
            setHoveredItem({index: hoveredItem.index - 1, hovered: true})
            itemRef?.current?.previousElementSibling?.scrollIntoView({behavior: 'instant', block: 'center'})
          } else if (!hoveredItem) {
            callbacks.dropHoveredItemToStart()
          }
          break;
        case "Escape":
          e.preventDefault()
          collapseDropdown(true)
          break;
      }
    }
    dropdownRef.current?.addEventListener('keydown', onDropdownKeyDown)
    return () => dropdownRef.current?.removeEventListener('keydown', onDropdownKeyDown)
  }, [buildedOptions, hoveredItem, multiple, value, onSelect])

  useEffect(() => {
    function onChange(e: any) {
      callbacks.dropHoveredItemToNull()
      setBuildedOptions(optionsBuilder(e.target.value))
    }
    setBuildedOptions(optionsBuilder(inputRef.current?.value || ''))
    inputRef.current?.addEventListener('input', onChange)
    return () => inputRef.current?.removeEventListener('input', onChange)
  }, [options])

  return optionsViewBuilder({
    hoverController: {
      //li
      item: hoveredItem,
      onMouseEnterOption: callbacks.onMouseEnterOption,
      itemRef: itemRef,
      //ul
      onMouseLeaveList: callbacks.onMouseLeaveList,
      listRef,
    },
    optionsController: {
      //li
      onSelect: callbacks.onSelect,
      //ul
      buildedOptions,
    },
  })
}

export default memo(Options)