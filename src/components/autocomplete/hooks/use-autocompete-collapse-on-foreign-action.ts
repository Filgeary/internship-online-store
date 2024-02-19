import { Dispatch, RefObject, useEffect } from "react";

type Params = {
  toggleDropdownButtonRef: RefObject<HTMLButtonElement | null>
  dropdownRef: RefObject<HTMLDivElement | null>
  setDropdownCollapsed: Dispatch<React.SetStateAction<boolean>>
  isDropdownCollapsed: boolean
}

function useAutocompeteCollapseOnForeignAction(params: Params) {
  const {
    isDropdownCollapsed, setDropdownCollapsed, toggleDropdownButtonRef, dropdownRef
  } = params

  useEffect(() => {
    function findParent(node: Node, target: Node | null): boolean {
      if (target === null) return false;
      if (node === target) return true;
      else return node.parentNode ? findParent(node.parentNode, target) : false
    }
    const clickHandler = (e: MouseEvent) => {
      if (e.target && e.target !== toggleDropdownButtonRef?.current && !findParent(e.target as Node, dropdownRef?.current)) {
        setDropdownCollapsed(true)
      }
    }
    const focusHandler = (e: FocusEvent) => {
      if (e.target && e.target !== toggleDropdownButtonRef?.current && !findParent(e.target as Node, dropdownRef?.current)) {
        setDropdownCollapsed(true)
        toggleDropdownButtonRef?.current?.focus()
      }
    }
    if (!isDropdownCollapsed) {
      document.body.addEventListener('click', clickHandler)
      document.body.addEventListener('focusin', focusHandler)
      return () => {
        document.body.removeEventListener('click', clickHandler)
        document.body.removeEventListener('focusin', focusHandler)
      }
    }
  }, [isDropdownCollapsed])
}

export default useAutocompeteCollapseOnForeignAction