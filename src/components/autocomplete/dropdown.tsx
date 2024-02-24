import { ReactNode, type RefObject, memo, useEffect, useState, useLayoutEffect } from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css'

type Props = {
  dropdownClassName: string
  collapseDropdown: (focusOnButton?: boolean) => void
  refs: {
    button: RefObject<HTMLButtonElement>
    dropdown: RefObject<HTMLDivElement>
  }
  children: ReactNode | ReactNode[]
}

function Dropdown(props: Props) {
  const cn = bem('Dropdown');
  const refs = props.refs

  const [position, setPosition] = useState('bottom');

  useEffect(() => {
    function foreignClickOrFocus(e: MouseEvent | FocusEvent) {
      if (
        !(refs.button.current as Node).contains(e.target as Node)
        && 
        !(refs.dropdown.current as Node).contains(e.target as Node)
      ) {
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
  
  useLayoutEffect(() => {
    const $dropdown = refs.dropdown.current
    if (!$dropdown) return
    const dropdownHeight = $dropdown.clientHeight;
    const spaceBelow = window.innerHeight - $dropdown.getBoundingClientRect().bottom;
    if (spaceBelow < dropdownHeight) {
      setPosition('top');
    } else {
      setPosition('bottom');
    }
  }, []);

  return (
    <div
        tabIndex={-1} 
        className={props.dropdownClassName + ' ' + cn('', {
          position
        })} 
        ref={refs.dropdown}
      >
        {props.children}
    </div>
  )
}

export default memo(Dropdown)