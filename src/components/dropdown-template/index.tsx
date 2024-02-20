import { useEffect, useRef, useState } from 'react';
import { cn as bem } from "@bem-react/classname";
import { DropdownTemplateProps } from './type';
import './style.css';
import useKeyPress from '@src/hooks/use-key-press';
import { checkPosition } from '@src/utils/check-position';

function DropdownTemplate(props: DropdownTemplateProps) {
  const cn = bem("Dropdown");
  const [open, setOpen] = useState(false);
  const [focusInd, setFocusInd] = useState(-1);
  const space = useKeyPress(" ");
  const arrowDown = useKeyPress("ArrowDown");
  const arrowUp = useKeyPress("ArrowUp");
  const escape = useKeyPress("Escape");
  const selectContainer = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownHeight = 160;
  const position = checkPosition(selectContainer, dropdownHeight);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (event: Event) => {
    if (
      selectContainer.current &&
      !selectContainer.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  const callbacks = {
    onOpen: () => {
      setOpen(!open);
    },
  };

  useEffect(() => {
    if (space && !open) {
      callbacks.onOpen();
      searchRef.current?.focus();
    } else if (open && escape) {
      setOpen(false);
    } else if (arrowDown && focusInd < props.countOfOptions) {
      setFocusInd((prev) => prev + 1);
    } else if (arrowUp && focusInd > 0) {
      setFocusInd((prev) => prev - 1);
    }
  }, [space, escape, arrowDown, arrowUp])

  return (
    <div className={cn()} ref={selectContainer}>
      <div className={cn("selected")} onClick={callbacks.onOpen}>
        <div className={cn("all")}>{props.renderSelectedItem()}</div>
        <div className={cn("arrow", { open })}></div>
      </div>
      <div
        className={cn("menu__wrapper", { open, position })}
      >
        {props.renderInput(searchRef)}
        {props.renderOptions(focusInd)}
      </div>
    </div>
  );
}

export default DropdownTemplate;
