import { forwardRef, useLayoutEffect, useState } from "react";
import { Option } from "../types";

type SelectCustomMenuProps = {
  enableSearch: boolean;
  filteredOptions: Option[];
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref: React.MutableRefObject<HTMLUListElement>;
  selectedOption: Option;
  hoveredOptionObject: Option;
  onClose: () => void;
  onChange: (optionValue: Option["value"]) => void;
};

const SelectCustomMenu = forwardRef(function SelectCustomMenu(
  {
    enableSearch,
    search,
    onSearch,

    filteredOptions,
    hoveredOptionObject,
    selectedOption,
    onClose,
    onChange,
  }: SelectCustomMenuProps,
  ref: React.MutableRefObject<HTMLUListElement>
) {
  const [position, setPosition] = useState("down");
  useLayoutEffect(() => {
    const checkPosition = () => {
      console.log(ref.current);
      if (ref.current) {
        const dropdownRect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (dropdownRect.bottom > windowHeight) {
          setPosition("up");
        } else {
          setPosition("down");
        }
      }
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);

    return () => {
      window.removeEventListener("resize", checkPosition);
    };
  }, []);
  return (
    <div
      className={
        position === "up" ? ` SelectCustom-menu-up` : "SelectCustom-menu"
      }
    >
      {enableSearch && (
        <input
          value={search}
          onChange={(e) => onSearch(e)}
          placeholder="Поиск"
          className="SelectCustom-search"
        ></input>
      )}
      <ul ref={ref} className="SelectCustom-options" role="listbox">
        {!!filteredOptions.length &&
          filteredOptions.map((el) => {
            return (
              <li
                title={el.title}
                className={
                  el.value === selectedOption.value
                    ? "SelectCustom-option-selected"
                    : el.value === hoveredOptionObject.value
                    ? "SelectCustom-option-hovered"
                    : "SelectCustom-option"
                }
                onClick={() => {
                  onClose();
                  onChange(el.value);
                }}
              >
                <div className="SelectCustom-shortcut">{el?.shortcut}</div>
                <div className="SelectCustom-title">{el?.title}</div>
              </li>
            );
          })}
        {!filteredOptions.length && (
          <div className="SelectCustom-notFound">Не найдено</div>
        )}
      </ul>
    </div>
  );
});

export default SelectCustomMenu;
