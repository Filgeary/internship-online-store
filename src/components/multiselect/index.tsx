import { useEffect, useRef, useState } from "react";
import "./style.css";
import { ArrowDown } from "../icons/arrow-down";
import { ArrowUp } from "../icons/arrow-up";
import useStore from "@src/hooks/use-store";
import { useClickOutside } from "@src/hooks/use-click-outside";
import { Option } from "./types";
import MultiSelectMenu from "./multiselect-menu";

type SelectProps = {
  selected: Option[] | null;
  options: Option[];
  enableSearch?: boolean;
  onChange?: (option: Option) => void;
  onClose?: () => void;
};

function MultiSelect({
  selected,
  options,
  onChange,
  enableSearch = false,
}: SelectProps) {
  const store = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) => {
    const regExp = new RegExp("^" + search, "i");
    const optionWords = option.title.split(" ");
    return optionWords.some((optionWord) => {
      const res = regExp.test(optionWord);
      return res;
    });
  });

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const ulRef = useRef<HTMLUListElement>(null);

  const [hoveredOption, setHoveredOption] = useState(0);

  const onOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
    setHoveredOption(0);
    setSearch("");
    !isOpen && store.actions.countries.load();
  };

  const onClose = () => {
    setIsOpen(false);
    setSearch("");
  };
  const rootRef = useClickOutside(onClose);

  const hoveredOptionObject = filteredOptions[hoveredOption];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();

        if (isOpen && hoveredOption === filteredOptions.length - 1) {
          setHoveredOption(0);
          (ulRef.current.childNodes[0] as HTMLLIElement).scrollIntoView({
            block: "nearest",
          });
          break;
        }

        if (isOpen) {
          setHoveredOption((hoveredOption) => hoveredOption + 1);
          (
            ulRef.current.childNodes[hoveredOption + 1] as HTMLLIElement
          ).scrollIntoView({
            block: "nearest",
          });
          break;
        }

      case "ArrowUp":
        e.preventDefault();
        if (isOpen && hoveredOption === 0) {
          setHoveredOption(filteredOptions.length - 1);
          (
            ulRef.current.childNodes[
              filteredOptions.length - 1
            ] as HTMLLIElement
          ).scrollIntoView({
            block: "nearest",
          });
          break;
        }

        if (isOpen) {
          setHoveredOption(hoveredOption - 1);
          (
            ulRef.current.childNodes[hoveredOption - 1] as HTMLLIElement
          ).scrollIntoView({
            block: "nearest",
          });
          break;
        }

      case "Enter":
        onChange(hoveredOptionObject);
        break;

      case "Escape":
        onClose();
        break;

      default:
        break;
    }
  };

  // useEffect(() => {
  //   if (isOpen && ulRef.current && selected) {
  //     (
  //       ulRef.current.childNodes[selectedOptionIndex] as HTMLLIElement
  //     ).scrollIntoView({ block: "center" });
  //   }
  // }, [isOpen]);

  return (
    <div className="SelectCustom" ref={rootRef}>
      <div className="SelectCustom-container">
        <button
          className="SelectCustom-selected"
          onClick={(event) => onOpen(event)}
          onKeyDown={(e) => handleKeyDown(e)}
        >
          {selected[0].value === "" && (
            <div className="SelectCustom-shortcut"></div>
          )}
          {selected[0].value !== "" && (
            <div className="SelectCustom-shortcut">{selected.length}</div>
          )}

          {selected[0].value === "" && (
            <div className="SelectCustom-title">Выберите страны</div>
          )}

          {selected[0].value !== "" && (
            <div className="SelectCustom-title">Стран выбрано</div>
          )}

          <div className="SelectCustom-arrow">
            {isOpen ? <ArrowUp /> : <ArrowDown />}
          </div>
        </button>
        {isOpen && (
          <MultiSelectMenu
            onClose={onClose}
            onSearch={onSearch}
            ref={ulRef}
            search={search}
            selectedOptions={selected}
            onChange={onChange}
            hoveredOptionObject={hoveredOptionObject}
            filteredOptions={filteredOptions}
            enableSearch={enableSearch}
          />
        )}
      </div>
    </div>
  );
}

export default MultiSelect;
