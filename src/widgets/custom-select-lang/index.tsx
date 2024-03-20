import React, {useRef} from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';
import {CustomSelectLangProps} from "@src/widgets/custom-select-lang/types";



function CustomSelectLang({
                            option = {_id: '', title: 'Все', code: ''},
                            onSelected,
                            hovered,
                            changeIndex,
                            checked = false,
                            index
                          }: CustomSelectLangProps) {
  const cn = bem('langItemContainer');
  const element = useRef(document.createElement('li'))

  function onSelect() {
    if (onSelected) {
      onSelected(option._id)
    }
  }

  function hoveredElement() {
    changeIndex(index)
  }

  return (
    <li className={(cn()) + (hovered ? ' hovered' : '')}
        onMouseEnter={hoveredElement} onClick={onSelect} ref={element}>
      <div className={cn('body')}>
        <div className={cn('title')}>{option.code}</div>
        <div className={cn('name')}>{option.title}</div>
      </div>
      <input className={cn('checkbox')} readOnly={true} tabIndex={-1} checked={checked} type={'checkbox'}/>
    </li>
  );
}

export default CustomSelectLang;
