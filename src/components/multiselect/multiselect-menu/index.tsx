import { forwardRef, useLayoutEffect, useState } from "react";
import { Option } from "../types";
import { Cross } from "@src/components/icons/cross";

type SelectCustomMenuProps = {
  enableSearch: boolean;
  filteredOptions: Option[];
  search: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref: React.MutableRefObject<HTMLUListElement>;
  selectedOptions: Option[];
  hoveredOptionObject: Option;
  onClose: () => void;
  onChange: (option: Option) => void;
};

const MultiSelectMenu = forwardRef(function MultiSelectMenu(
  {
    enableSearch,
    search,
    onSearch,
    filteredOptions,
    hoveredOptionObject,
    selectedOptions,
    onClose,
    onChange,
  }: SelectCustomMenuProps,
  ref: React.MutableRefObject<HTMLUListElement>
) {
  const [position, setPosition] = useState("down");
  useLayoutEffect(() => {
    const checkPosition = () => {
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

  const isSelected = (option: Option) => {
    return selectedOptions.some((el) => el.value === option.value);
  };

  const onClickDelete = (event: React.MouseEvent<HTMLDivElement>, element) => {
    event.stopPropagation();
    onChange(element);
  };

  return (
    <div
      className={
        position === "up" ? ` SelectCustom-menu-up` : "SelectCustom-menu"
      }
    >
      {selectedOptions[0].value !== "" && (
        <div className="SelectCustom-menu-badgeWrapper">
          {selectedOptions.map((el) => {
            return (
              <div className="SelectCustom-menu-badge">
                {el.title}{" "}
                <div
                  className="SelectCustom-menu-badge-close"
                  onClick={(event) => onClickDelete(event, el)}
                >
                  <Cross />
                </div>
              </div>
            );
          })}
        </div>
      )}
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
                  isSelected(el)
                    ? "SelectCustom-option-selected"
                    : el.value === hoveredOptionObject.value
                    ? "SelectCustom-option-hovered"
                    : "SelectCustom-option"
                }
                onClick={() => {
                  onChange(el);
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

export default MultiSelectMenu;
