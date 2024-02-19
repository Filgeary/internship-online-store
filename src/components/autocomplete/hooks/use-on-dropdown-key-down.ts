import { useCallback, KeyboardEvent , Dispatch, RefObject} from "react"
import { Option } from "../types"

type Params<O extends Option> = {
  hoveredItem: {index: number, hovered: boolean} | null
  setHoveredItem: Dispatch<React.SetStateAction<{index: number, hovered: boolean} | null>>
  buildedOptions: O[]
  setDropdownCollapsed: Dispatch<React.SetStateAction<boolean>>
  toggleDropdownButtonRef: RefObject<HTMLButtonElement>
  multiple?: true | undefined
  value: O | O[] | undefined,
  onSelected: (option: O) => void
}

function useOnDropdownKeyDown<O extends Option>(params: Params<O>) {

  const {
    buildedOptions, hoveredItem, setDropdownCollapsed,
    toggleDropdownButtonRef, value, multiple,
    setHoveredItem, onSelected
  } = params

  return useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "Enter": 
        e.preventDefault()
        if (!hoveredItem) break
        const founded = buildedOptions.find((_, i) => i === hoveredItem?.index)
        if (!founded) break
        if (!multiple && (value as O | undefined)?.value != founded.value) {
          setDropdownCollapsed(true)
          toggleDropdownButtonRef?.current?.focus()
        }
        onSelected(founded)
        break
      case "ArrowDown":
        e.preventDefault()
        if (!hoveredItem) setHoveredItem({hovered: true, index: 0});
        if (hoveredItem && buildedOptions.length > (hoveredItem.index + 1)) {
          setHoveredItem({ index: hoveredItem.index + 1, hovered: true})
        }
        break;
      case "ArrowUp":
        e.preventDefault()
        if (!hoveredItem) setHoveredItem({hovered: true, index: 0});
        if (hoveredItem && (hoveredItem.index - 1) >= 0 ) {
          setHoveredItem({index: hoveredItem.index - 1, hovered: true})
        }
        break;
      case "Escape":
        e.preventDefault()
        setDropdownCollapsed(true)
        toggleDropdownButtonRef?.current?.focus()
        break;
      default:
        return;
    }
  }, [buildedOptions, hoveredItem, multiple, value])
}

export default useOnDropdownKeyDown