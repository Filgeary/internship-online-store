import { ChangeEvent, KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutocompleteProps, ContainerViewBuilder, FieldViewBuilderProps, Option, OptionsViewBuilder } from "./types";
import {cn as bem} from '@bem-react/classname';
import './style.css'

function Autocomplete<O extends Option>(props: AutocompleteProps<O>) {
  const cn = bem('AutoComplete');
  const [inputValue, setInputValue] = useState<string>('')
  const [isCollapsed, setCollapsed] = useState<boolean>(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const liRef = useRef<HTMLLIElement>(null)

  const callbacks = {
    onInput: useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }, []),

    onToggle: useCallback(() => setCollapsed(prev => !prev), []),

    onOptionKeyUp: useCallback((e: KeyboardEvent<HTMLLIElement>, option: O) => {
      //@ts-ignore
      if (e.key === 'Enter') e.target.click()
    }, []),

    onKeyDown: useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      const activeElement = document.activeElement
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          if (activeElement === inputRef?.current) {
            liRef?.current?.focus()
          } else if (activeElement === buttonRef?.current) {
            inputRef?.current?.focus()
          } else {
            //@ts-ignore
            activeElement?.nextElementSibling?.focus()
          }
          break;
        case "ArrowUp":
          e.preventDefault()
          if (activeElement === inputRef?.current) {
            buttonRef?.current?.focus()
          }  else if (activeElement === liRef?.current) {
            inputRef?.current?.focus()
          } else {
            //@ts-ignore
            activeElement?.previousElementSibling?.focus()
          }
          break;
        case "Escape":
          buttonRef?.current?.focus()
          setCollapsed(true)
          break;
        default:
          return;
      }
    }, []),

    onSelected: useCallback((option: O) => {
      if (!props.multiple && props.value?.value != option.value) {
        setCollapsed(true)
        buttonRef?.current?.focus()
      }
      props.onSelected(option)
    }, [props.onSelected, props.value, props.multiple]),
  }


  useEffect(() => {
    if (isCollapsed) return;
    inputRef?.current?.focus()
  }, [isCollapsed])

  const filteredOptions = useMemo(() => (
    props.optionsBuilder(inputValue)
  ), [inputValue, props.options])


  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      function findParent(node: Node, target: Node | null): boolean {
        if (target === null) return false
        if (node === target) return true
        else return node.parentNode ? findParent(node.parentNode, target) : false
      }
      
      if (e.target && e.target !== buttonRef?.current && !findParent(e.target as Node, dropdownRef?.current)) {
        setCollapsed(true)
      }
    }
    !isCollapsed && document.body.addEventListener('click', clickHandler)
    return () => {!isCollapsed && document.body.removeEventListener('click', clickHandler)}
  }, [isCollapsed])
  
  
  return(
    <div className={cn()} onKeyDown={callbacks.onKeyDown}>
      {
        props.containerViewBuilder({
          onToggle: callbacks.onToggle,
          tabIndex: 0,
          buttonRef,
          isCollapsed
        })
      }
      {!isCollapsed && <div className={props.dropdownClassName || cn('dropdown')} ref={dropdownRef}>
        {
          props.fieldViewBuilder({
            textEditingController: {
              value: inputValue, onChange: callbacks.onInput 
            },
            focusNode: inputRef,
            tabIndex: 0
          })
        }
        {
          props.optionsViewBuilder({
            onSelected: callbacks.onSelected,
            onKeyUp: callbacks.onOptionKeyUp,
            filteredOptions,
            liRef,
          })
        }
      </div>}
    </div>
  )
}

export default memo(Autocomplete) as typeof Autocomplete
