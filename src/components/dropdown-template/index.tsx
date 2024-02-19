import { useEffect, useRef, useState } from 'react';
import { cn as bem } from "@bem-react/classname";
import { DropdownTemplateProps } from './type';
import './style.css';
import useKeyPress from '@src/hooks/use-key-press';

function DropdownTemplate(props: DropdownTemplateProps) {
  const cn = bem("Dropdown");
  const [open, setOpen] = useState(false);
  const space = useKeyPress(" ");
  const arrowDown = useKeyPress("ArrowDown");
  const arrowUp = useKeyPress("ArrowUp");
  const escape = useKeyPress("Escape");
  const selectContainer = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownHeight = 160;
  const windowHeight = window.innerHeight;
  const dropdownTop = selectContainer.current?.getBoundingClientRect().top;

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

  useEffect(() => {
    if(space && !open) {
      setOpen(true);
      searchRef.current?.focus();
    }
  }, [space])

  useEffect(() => {
    if(arrowDown) {
      searchRef.current?.blur();
    }
  })

  useEffect(() => {
    if(open && escape) setOpen(false)
  }, [escape])

  return (
    <div className={cn()} ref={selectContainer}>
      <div className={cn("selected")} onClick={() => setOpen(!open)}>
        <div className={cn("all")}>{props.renderSelectedItem()}</div>
        <div className={cn("arrow", { open })}></div>
      </div>
      <div
        className={cn("menu__wrapper", {
          open,
          position: windowHeight - dropdownTop! < dropdownHeight,
        })}
      >
        {props.renderInput(searchRef)}
        {props.renderOptions()}
      </div>
    </div>
  );
}

export default DropdownTemplate;
