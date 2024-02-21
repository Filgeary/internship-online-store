import { useEffect, useRef, useState } from "react";
import "./style.css";
import { ArrowDown } from "../icons/arrow-down";
import { ArrowUp } from "../icons/arrow-up";
import useStore from "@src/hooks/use-store";
import { useClickOutside } from "@src/hooks/use-click-outside";
import { Option } from "./types";
import SelectCustomMenu from "./select-custom-menu";

type SelectProps = {
  selected: Option["value"] | null;
  options: Option[];
  enableSearch?: boolean;
  onChange?: (selected: Option["value"]) => void;
  onClose?: () => void;
};

function SelectCustom({
  selected,
  options,
  onChange,
  enableSearch = false,
}: SelectProps) {
  const store = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((el) => {
    return el.value === selected;
  });

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

  const selectedOptionIndex = filteredOptions
    .map((e) => e.value)
    .indexOf(selected);

  const [hoveredOption, setHoveredOption] = useState(selectedOptionIndex);

  const onOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
    setHoveredOption(selectedOptionIndex);
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
        onChange(hoveredOptionObject.value);
        break;

      case "Escape":
        onClose();
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (isOpen && ulRef.current && selected) {
      (
        ulRef.current.childNodes[selectedOptionIndex] as HTMLLIElement
      ).scrollIntoView({ block: "center" });
    }
  }, [isOpen]);

  return (
    <div className="SelectCustom" ref={rootRef}>
      <div className="SelectCustom-container">
        <button
          className="SelectCustom-selected"
          onClick={(event) => onOpen(event)}
          onKeyDown={(e) => handleKeyDown(e)}
        >
          <div className="SelectCustom-shortcut">
            {selectedOption?.shortcut}
          </div>
          <div className="SelectCustom-title">{selectedOption?.title}</div>
          <div className="SelectCustom-arrow">
            {isOpen ? <ArrowUp /> : <ArrowDown />}
          </div>
        </button>
        {isOpen && (
          <SelectCustomMenu
            onClose={onClose}
            onSearch={onSearch}
            ref={ulRef}
            search={search}
            selectedOption={selectedOption}
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

export default SelectCustom;
