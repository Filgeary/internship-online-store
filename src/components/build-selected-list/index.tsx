import React, {useEffect, useRef} from 'react';
import CustomSelectLang from "@src/components/custom-select-lang";
import {cn as bem} from "@bem-react/classname";
import './style.css'

interface OptionType {
  _id: string,
  title: string,
  code: string,
  selected: boolean
}


interface BuildSelectedListProps {
  onSelected: (langCode: string) => void,
  filteredOptions: OptionType[],
  selectedOptionIndex: number,
  setSelectedOptionIndex: (index: number) => void,
  visible: boolean
}

function BuildSelectedList({onSelected, filteredOptions, selectedOptionIndex, setSelectedOptionIndex, visible}: BuildSelectedListProps) {
  const cn = bem('BuildSelectedList');
  const list = useRef(document.createElement("ul"))

  function scrollList(e: KeyboardEvent) {
    if(e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'Tab' && list.current) {
      e.preventDefault()
      const currentList = list.current;
      const child: Element = currentList.childNodes[selectedOptionIndex] as Element;
      const childRect = child?.getBoundingClientRect()
      const parentRect = currentList?.getBoundingClientRect();
      // Проверяем, находится ли дочерний элемент внутри родительского элемента по вертикали
      if (childRect.top < parentRect.top || childRect.bottom >= parentRect.bottom) {
        // Скролим родительский элемент на высоту дочернего элемента
        currentList.scrollTo({
          top: currentList.scrollTop + childRect.bottom + childRect.height - parentRect.bottom
        });
      }
    }
  }

  useEffect(() => {
    if(visible){
      window.addEventListener('keydown', scrollList)
      return () => window.removeEventListener('keydown', scrollList)
    } else {
      list.current?.scrollTo({top: 0})
    }
  }, [selectedOptionIndex, visible]);


  return (
    <ul className={cn()} ref={list}>
      {filteredOptions.map((element, index) => {
        return (
          <CustomSelectLang
            key={element._id}
            hovered={index === selectedOptionIndex}
            onSelected={onSelected}
            option={element}
            changeIndex={setSelectedOptionIndex}
            checked={element.selected}
            index={index}
          />)
      })}
    </ul>
  );
}

export default BuildSelectedList;
