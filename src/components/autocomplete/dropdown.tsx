import { ReactNode, RefObject, memo, useEffect } from "react";

type Props = {
  dropdownClassName: string
  collapseDropdown: (focusOnButton?: boolean) => void
  refs: {
    buttonRef: RefObject<HTMLButtonElement>
    dropdownRef: RefObject<HTMLDivElement>
  }
  children: ReactNode | ReactNode[]
}

function Dropdown(props: Props) {
  const refs = props.refs

  useEffect(() => {
    function foreignClickOrFocus(e: MouseEvent | FocusEvent) {
      if (e.target !== refs.buttonRef.current && e.target !== refs.dropdownRef.current) {
        props.collapseDropdown(e.type === 'focusin')
      }
    }
    document.body.addEventListener('click', foreignClickOrFocus)
    document.body.addEventListener('focusin', foreignClickOrFocus)
    return () => {
      document.body.removeEventListener('click', foreignClickOrFocus)
      document.body.removeEventListener('focusin', foreignClickOrFocus)
    }
  }, [])

  return (
    <div
        tabIndex={-1} 
        className={props.dropdownClassName} 
        ref={refs.dropdownRef}
      >
        {props.children}
    </div>
  )
}

export default memo(Dropdown)