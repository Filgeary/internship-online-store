import { type RefObject, memo, useCallback, useEffect, useRef, useState } from "react";
import type { AutocompleteProps, Option } from "./types";
import ListElement from "./list-element";


type BaseProps<O extends Option> = {
  listViewBuilder: AutocompleteProps<O>['listViewBuilder']
  listElementViewBuilder: AutocompleteProps<O>['listElementViewBuilder']
  options: O[]
  collapseDropdown: (focusOnButton?: boolean) => void
  onSelect: (option: O) => void,
  refs: {
    dropdown: RefObject<HTMLDivElement>
    input: RefObject<HTMLInputElement>
  }
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

function List<O extends Option>(props: Props<O>) {
  const {refs, multiple, value} = props
  const triggerMouseEnterRef = useRef<boolean>(true)
  const [hoveredItem, setHoveredItem] = useState<{index: number, hovered: boolean} | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listElementRef = useRef<HTMLLIElement>(null)
  const [buildedOptions, setBuildedOptions] = useState<O[]>(props.options)

  const callbacks = {
    onMouseEnterListElement: useCallback((index: number) => {
      //Включаем подсветку элементов наведением мыши
      if (!triggerMouseEnterRef.current) {
        triggerMouseEnterRef.current = true;
        return
      } 
      setHoveredItem({hovered: true, index})
    }, []),

    onMouseLeaveList: useCallback(() => setHoveredItem(prev => 
      (prev?.index || prev?.index === 0) ? ({...prev, hovered: false}) : null)
    , []),

    onSelect: useCallback((option: O) => {
      if (!props.multiple && props.value?.value != option.value) {
        props.collapseDropdown(true)
      }
      props.onSelect(option)
    }, [props.onSelect, props.value, props.multiple]),

    dropHoveredItemToStart: useCallback(() => setHoveredItem({hovered: true, index: 0}), []),

    dropHoveredItemToNull: useCallback(() => setHoveredItem(null), []),
  }

  //Обработка навигации клавиатурой по dropdown
  useEffect(() => {
    function onDropdownKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        // Выбор/отмена выбора опции
        case "Enter": 
          e.preventDefault()
          if (!hoveredItem) break
          const founded = buildedOptions.find((_, i) => i === hoveredItem?.index)
          if (!founded) break
          // Закрываем dropdown, если одиночный выбор и выбрана опция
          if (!props.multiple && props.value?.value != founded.value) {
            props.collapseDropdown(true)
          }

          props.onSelect(founded)
        break
        // Навигация вниз
        case "ArrowDown":
          e.preventDefault()
          if (hoveredItem && buildedOptions.length > (hoveredItem.index + 1)) {
            //Отменяем подсветку элементов наведением мыши
            triggerMouseEnterRef.current = false
            listElementRef?.current?.nextElementSibling?.scrollIntoView({behavior: 'instant', block: 'center'})
            setHoveredItem({ index: hoveredItem.index + 1, hovered: true})
          } else if (!hoveredItem) {
            callbacks.dropHoveredItemToStart()
          }
          break;
        // Навигация вверх
        case "ArrowUp":
          e.preventDefault()
          if (hoveredItem && (hoveredItem.index - 1) >= 0 ) {
            //Отменяем подсветку элементов наведением мыши
            triggerMouseEnterRef.current = false
            setHoveredItem({index: hoveredItem.index - 1, hovered: true})
            listElementRef?.current?.previousElementSibling?.scrollIntoView({behavior: 'instant', block: 'center'})
          } else if (!hoveredItem) {
            callbacks.dropHoveredItemToStart()
          }
          break;
        // Выход из autocomplete
        case "Escape":
          e.preventDefault()
          props.collapseDropdown(true)
          break;
      }
    }
    refs.dropdown.current?.addEventListener('keydown', onDropdownKeyDown)
    return () => refs.dropdown.current?.removeEventListener('keydown', onDropdownKeyDown)
  }, [buildedOptions, hoveredItem, props.multiple, props.value, props.onSelect])

  // Установка состояния buildedOptions при изменении в input и изменении options
  useEffect(() => {
    function onChange(e: any) {
      callbacks.dropHoveredItemToNull()
      setBuildedOptions(props.optionsBuilder(e.target.value))
    }
    setBuildedOptions(props.optionsBuilder(refs.input.current?.value || ''))
    refs.input.current?.addEventListener('input', onChange)
    return () => refs.input.current?.removeEventListener('input', onChange)
  }, [props.options])

  if (multiple) {
    return props.listViewBuilder({
      children: buildedOptions.map((option, i) => (
        <ListElement
          hovered={typeof hoveredItem?.index === 'number' && (hoveredItem.index === i) && hoveredItem.hovered}
          // active={typeof hoveredItem?.index === 'number' && (hoveredItem.index === i)}
          index={i}
          listElementRef={typeof hoveredItem?.index === 'number' && (hoveredItem.index === i) ? listElementRef : undefined}
          onSelect={callbacks.onSelect as (option: Option) => void}
          option={option}
          onMouseEnterListElement={callbacks.onMouseEnterListElement}
          listElementViewBuilder={props.listElementViewBuilder}
          value={value}
          key={option.value}
          multiple={multiple}
        />
      )),
      listRef,
      onMouseLeaveList: callbacks.onMouseLeaveList
    })
  }

  return props.listViewBuilder({
    children: buildedOptions.map((option, i) => (
      <ListElement
        hovered={typeof hoveredItem?.index === 'number' && (hoveredItem.index === i) && hoveredItem.hovered}
        // active={typeof hoveredItem?.index === 'number' && (hoveredItem.index === i)}
        index={i}
        listElementRef={typeof hoveredItem?.index === 'number' && (hoveredItem.index === i) ? listElementRef : undefined}
        onSelect={callbacks.onSelect as (option: Option) => void}
        option={option}
        onMouseEnterListElement={callbacks.onMouseEnterListElement}
        listElementViewBuilder={props.listElementViewBuilder}
        value={value}
        key={option.value}
        multiple={multiple}
      />
    )),
    listRef,
    onMouseLeaveList: callbacks.onMouseLeaveList
  })
}

export default memo(List)