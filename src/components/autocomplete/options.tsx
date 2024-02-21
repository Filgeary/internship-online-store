import { Dispatch, RefObject, memo, useCallback, useRef } from "react";
import { AutocompleteProps, Option } from "./types";
import useAutocompleteScrollAdjustment from "./hooks/use-autocomplete-scroll-adjustment";

type BaseProps<O extends Option> = {
  optionsViewBuilder: AutocompleteProps<O>['optionsViewBuilder']
  setHoveredItem: Dispatch<React.SetStateAction<{
    index: number;
    hovered: boolean;
} | null>>
  hoveredItem: {index: number, hovered: boolean} | null
  buildedOptions: O[]
  collapseDropdownAndFocusOnButton: () => void
  onSelect: (option: O) => void,
  itemRef: RefObject<HTMLLIElement>
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
  const {itemRef,optionsViewBuilder, multiple, value, onSelect, setHoveredItem, hoveredItem, buildedOptions, collapseDropdownAndFocusOnButton} = props

  const triggerMouseEnterRef = useRef<boolean>(true)
  // const listItemRef = useRef<HTMLLIElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const callbacks = {
    onMouseEnterOption: useCallback((index: number) => {
      if (!triggerMouseEnterRef.current) return triggerMouseEnterRef.current = true;
      setHoveredItem({hovered: true, index})
    }, []),

    onMouseLeaveList: useCallback(() => setHoveredItem(prev => (prev?.index || prev?.index === 0) ? ({...prev, hovered: false}) : null), []),

    onSelect: useCallback((option: O) => {
      if (!multiple && value?.value != option.value) {
        collapseDropdownAndFocusOnButton()
      }
      onSelect(option)
    }, [onSelect, value, multiple]),
  }

  useAutocompleteScrollAdjustment({
    hoveredItem, itemRef: itemRef, listRef, triggerMouseEnterRef
  })


  return optionsViewBuilder({
    hoverController: {
      item: hoveredItem,
      onMouseEnterOption: callbacks.onMouseEnterOption,
      onMouseLeaveList: callbacks.onMouseLeaveList,
      itemRef: itemRef,
      listRef,
    },
    optionsController: {
      onSelect: callbacks.onSelect,
      buildedOptions,
    },
  })
}

export default memo(Options)