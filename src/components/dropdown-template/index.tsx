import { useEffect, useRef, useState } from 'react';
import { cn as bem } from "@bem-react/classname";
import useKeyPress from '@src/hooks/use-key-press';
import { useClickOutside } from '@src/hooks/use-click-outside';
import { checkPosition } from '@src/utils/check-position';
import { DropdownTemplateProps } from './type';
import './style.css';

function DropdownTemplate(props: DropdownTemplateProps) {
  const cn = bem("Dropdown");
  const [open, setOpen] = useState(false);
  const [focusInd, setFocusInd] = useState(-1);
  const space = useKeyPress(" ");
  const arrowDown = useKeyPress("ArrowDown");
  const arrowUp = useKeyPress("ArrowUp");
  const escape = useKeyPress("Escape");
  const enter = useKeyPress("Enter");
  const selectContainer = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const position = checkPosition(selectContainer);

  useEffect(() => {
    if (focusInd < props.countOfOptions) {
      if (open && focusInd === -1) {
        searchRef.current?.focus();
      } else {
        searchRef.current?.blur();
      }
    if (space && !open) {
      setOpen(!open);
    } else if (open && escape) {
      setOpen(false);
    } else if (arrowDown) {
      setFocusInd((prev) => prev + 1);
      if (menuRef.current?.children[focusInd + 1]) {
        (
          menuRef.current?.children[focusInd + 1] as HTMLLIElement
        ).scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    } else if (arrowUp && focusInd > -1) {
      setFocusInd((prev) => prev - 1);
      if (menuRef.current?.children[focusInd - 1]) {
        (
          menuRef.current?.children[focusInd - 1] as HTMLLIElement
        ).scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    } else if(enter) {
      (menuRef.current?.children[focusInd] as HTMLLIElement).click();
    }} else {
      setFocusInd(-1);
    }
  }, [space, escape, arrowDown, arrowUp, enter])

  return (
    <div className={cn()} ref={selectContainer}>
      <div
        className={cn("selected")}
        onClick={() => setOpen(!open)}
      >
        <div className={cn("all")}>{props.renderSelectedItem(open)}</div>
        <div className={cn("arrow", { open })}></div>
      </div>
      <div className={cn("menu__wrapper", { open, position })}>
        {props.renderInput(searchRef)}
        {props.renderOptions(focusInd, menuRef)}
      </div>
    </div>
  );
}

export default DropdownTemplate;
