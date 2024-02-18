import { useEffect, useRef, useState } from 'react';
import {BiChevronDown} from 'react-icons/bi';
import { cn as bem } from "@bem-react/classname";
import { DropdownTemplateProps } from './type';
import './style.css';

function DropdownTemplate(props: DropdownTemplateProps) {
  const cn = bem("Dropdown");
  const [open, setOpen] = useState(false);
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

  return (
    <div className={cn()} ref={selectContainer}>
      <div className={cn("selected")} onClick={() => setOpen(!open)}>
        <div className={cn("all")}>
          {props.renderSelectedItem()}
        </div>
        <BiChevronDown
          size={20}
          className={cn("arrow")}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </div>
      <div
        className={cn("menu__wrapper")}
        style={{ maxHeight: open ? "163px" : "0" }}
      >
        {props.renderInput()}
        {props.renderOptions()}
      </div>
    </div>
  );
}

export default DropdownTemplate;
