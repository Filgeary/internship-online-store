import { ReactNode, RefObject, memo, useEffect, useRef } from "react";

type Props = {
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  dropdownClassName: string
  collapseDropdown: () => void
  collapseDropdownAndFocusOnButton: () => void
  children: ReactNode | ReactNode[]
  buttonRef: RefObject<HTMLButtonElement>
}

function Dropdown(props: Props) {
  const {onKeyDown, dropdownClassName, buttonRef, collapseDropdown, children, collapseDropdownAndFocusOnButton} = props

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function findParent(node: Node, target: Node | null): boolean {
      if (target === null) return false;
      if (node === target) return true;
      else return node.parentNode ? findParent(node.parentNode, target) : false
    }
    const clickHandler = (e: MouseEvent) => {
      if (e.target && e.target !== buttonRef.current && !findParent(e.target as Node, dropdownRef.current)) {
        collapseDropdown()
      }
    }
    const focusHandler = (e: FocusEvent) => {
      if (e.target && e.target !== buttonRef.current && !findParent(e.target as Node, dropdownRef.current)) {
        collapseDropdownAndFocusOnButton()
      }
    }
    document.body.addEventListener('click', clickHandler)
    document.body.addEventListener('focusin', focusHandler)
    return () => {
      document.body.removeEventListener('click', clickHandler)
      document.body.removeEventListener('focusin', focusHandler)
    }
  }, [])

  return (
    <div
        tabIndex={-1} 
        onKeyDown={onKeyDown} 
        className={dropdownClassName} 
        ref={dropdownRef}
      >
        {children}
    </div>
  )
}

export default memo(Dropdown)