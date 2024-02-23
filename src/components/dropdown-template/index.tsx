import { useCallback, useEffect, useRef, useState } from 'react';
import { cn as bem } from "@bem-react/classname";
import useKeyPress from '@src/hooks/use-key-press';
import { useClickOutside } from '@src/hooks/use-click-outside';
import { checkPosition } from '@src/utils/check-position';
import { DropdownTemplateProps } from './type';
import './style.css';
import { ChevronDown } from './arrow';

function DropdownTemplate(props: DropdownTemplateProps) {
  const cn = bem("Dropdown");
  const [open, setOpen] = useState(false);
  const [focusInd, setFocusInd] = useState(-1);
  let index = -1;
  const selectContainer = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const position = checkPosition(selectContainer);

  const callbacks = {
    onKeyOpen: () => {
      if (!open) setOpen(!open);
    },
    onKeyEscape: () => {
      if (open) setOpen(!open);
    },
    onKeyEnter: () => {
      if (open && menuRef.current?.children[index]) {
        (menuRef.current?.children[index] as HTMLLIElement).click();
      }
    },
    onKeyArrowDown: () => {
      if (index < props.countOfOptions && menuRef.current?.children.length) {
        ++index;
        setFocusInd(index);
        if (menuRef.current?.children[index]) {
          (menuRef.current?.children[index] as HTMLLIElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    },
    onKeyArrowUp: () => {
      if (index > -1 && menuRef.current?.children.length) {
        --index;
        setFocusInd(index);
        if (menuRef.current?.children[index]) {
          (menuRef.current?.children[index] as HTMLLIElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if(open && index === -1) {
      searchRef.current?.focus()
    } else {
      searchRef.current?.blur();
    }
    switch (e.key) {
      case " ": {
        e.preventDefault();
        callbacks.onKeyOpen();
        break;
      }
      case "Escape": {
        e.preventDefault();
        callbacks.onKeyEscape();
        break;
      }
      case "Enter": {
        e.preventDefault();
        callbacks.onKeyEnter();
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        callbacks.onKeyArrowDown();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        callbacks.onKeyArrowUp();
        break;
      }
    }
  };

  useEffect(() => {
    if(open) window.removeEventListener("keydown", handleKeyDown, true);
    return window.addEventListener("keydown", handleKeyDown, true)
  }, [open])

  return (
    <div className={cn()} ref={selectContainer}>
      <div className={cn("selected")} onClick={() => setOpen(!open)}>
        <div className={cn("all")}>{props.renderSelectedItem(open)}</div>
        <ChevronDown classValue={cn("arrow", { open })} />
      </div>
      <div className={cn("menu__wrapper", { open, position })}>
        {props.renderInput(searchRef)}
        {props.renderOptions(focusInd, menuRef)}
      </div>
    </div>
  );
}

export default DropdownTemplate;
