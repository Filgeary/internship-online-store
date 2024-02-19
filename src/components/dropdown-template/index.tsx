import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { cn as bem } from "@bem-react/classname";
import { DropdownTemplateProps } from './type';
import './style.css';
import useKeyPress from '@src/hooks/use-key-press';

function DropdownTemplate(props: DropdownTemplateProps) {
  const cn = bem("Dropdown");
  const [open, setOpen] = useState(false);
  const arrowDown = useKeyPress("ArrowDown");
  const arrowUp = useKeyPress("ArrowUp");
  const enter = useKeyPress("Enter");
  const escape = useKeyPress("Escape");
  const selectContainer = useRef<HTMLDivElement>(null);

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
    if(arrowDown && !open) {
      setOpen(true);
    }
  }, [arrowDown])

  useEffect(() => {
    if(open && escape) setOpen(false)
  }, [escape])

  return (
    <div className={cn()} ref={selectContainer}>
      <div className={cn("selected")} onClick={() => setOpen(!open)}>
        <div className={cn("all")}>{props.renderSelectedItem()}</div>
        <div
          className={cn("arrow", {open})}
        ></div>
      </div>
      <div
        className={cn("menu__wrapper", {open})}
      >
        {props.renderInput()}
        {props.renderOptions()}
      </div>
    </div>
  );
}

export default DropdownTemplate;
