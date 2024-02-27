import { useCallback, useEffect, useRef, useState } from 'react';
import { cn as bem } from "@bem-react/classname";
import { useClickOutside } from '@src/hooks/use-click-outside';
import { checkPosition } from '@src/utils/check-position';
import { DropdownTemplateProps } from './type';
import { ChevronDown } from '../icons/arrow/arrow';
import './style.css';

function DropdownTemplate(props: DropdownTemplateProps) {
  const cn = bem("Dropdown");
  const [open, setOpen] = useState(false);
  const [focusInd, setFocusInd] = useState(-1);
  const selectContainer = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const position = checkPosition(selectContainer);

  const callbacks = {
    onKeyOpen: () => {
      if (!open) setOpen(!open);
    },
    onKeyEscape: () => {
      if (open) {
        setOpen(!open);
        setFocusInd(0);
      }
    },
    onKeyEnter: () => {
      if (open && menuRef.current?.children[focusInd]) {
        (menuRef.current?.children[focusInd] as HTMLLIElement).click();
      }
    },
    onKeyArrowDown: useCallback(() => {
      if (focusInd < props.countOfOptions && menuRef.current?.children.length) {
        setFocusInd(prev => prev + 1);
        console.log(focusInd)
        if (menuRef.current?.children[focusInd + 1]) {
          (
            menuRef.current?.children[focusInd + 1] as HTMLLIElement
          ).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      } else {
        setFocusInd(0);
        if (menuRef.current?.children[0]) {
          (menuRef.current?.children[0] as HTMLLIElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }, [focusInd]),
    onKeyArrowUp: () => {
      if (focusInd > -1 && menuRef.current?.children.length) {
        setFocusInd(prev => prev - 1);
        if (menuRef.current?.children[focusInd - 1]) {
          (menuRef.current?.children[focusInd - 1] as HTMLLIElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      } else {
        const index = menuRef.current?.children.length! - 1;
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
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true)
  }, [handleKeyDown])

  return (
    <div className={cn()} ref={selectContainer}>
      <div className={cn("selected")} onClick={() => setOpen(!open)}>
        <div className={cn("all")}>{props.renderSelectedItem(open)}</div>
        <ChevronDown classValue={cn("arrow", { open })} />
      </div>
      <div className={cn("menu__wrapper", { open, position })}>
        {props.renderInput(searchRef, setFocusInd)}
        {props.renderOptions(focusInd, menuRef)}
      </div>
    </div>
  );
}

export default DropdownTemplate;
