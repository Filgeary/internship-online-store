import { cn as bem } from "@bem-react/classname";
import "./style.css";
import { ISelectCustomProps, Option, ShowDirection } from "./types";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useInit from "@src/hooks/use-init";
import svgArrow from "./arrow.svg";
import SelectedOptionsList from "./selected-options-list";
import useClickOutside from "@src/hooks/use-click-outside";

function SelectCustom<ValueType extends Option>(
  props: ISelectCustomProps<ValueType>
) {
  const cn = bem("SelectCustom");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDirection, setOpenDirection] = useState<ShowDirection>("down");
  const [selectedOptions, setSelectedOptions] = useState<
    ISelectCustomProps<ValueType>["value"]
  >(props.value);
  const [hoveredOption, setHoveredOption] = useState<{
    item: ValueType;
    isHovered: boolean;
  }>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [options, setOptions] = useState<ValueType[]>([]);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement[]>([]);

  const callbacks = {
    // Проверка для отображения options
    handleScroll: useCallback(() => {
      const selectRect = selectRef.current!.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const distanceToBottom = windowHeight - selectRect.bottom;

      setOpenDirection(distanceToBottom < 200 ? "up" : "down");
    }, [selectRef, window]),
    // Открытие и закрытие dropdown
    onDropdown: useCallback(
      (value?: boolean) => {
        setIsOpen((prev) => {
          const result = value === undefined ? !prev : value;
          if (!result) {
            setSearchValue("");
          }
          return result;
        });
      },
      [setIsOpen]
    ),
    onSearch: useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setOptions(
          props.options.filter((item) =>
            item.title
              .toLocaleLowerCase()
              .includes(e.target.value.toLocaleLowerCase())
          )
        );
      },
      [props]
    ),
    onSelect: useCallback(
      (item: ValueType) => {
        let result: ValueType | ValueType[];
        if (props.multiple == true) {
          if (Array.isArray(selectedOptions)) {
            result = selectedOptions.filter(
              (prevItem) => prevItem.value !== item.value
            );
            if (selectedOptions.length === result.length) {
              result.push({ ...item });
            }
          } else {
            result = [{ ...item }];
          }
          setSelectedOptions(result);
          props.onSelect(result);
        } else {
          result = { ...item };
          setSelectedOptions(result);
          props.onSelect(result);
        }
      },
      [setSelectedOptions, selectedOptions]
    ),
    onKeyDown: useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isOpen) {
          callbacks.onDropdown(true);
          return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.stopPropagation();
          e.preventDefault();
          if (e.key === "ArrowDown" && !hoveredOption && options.length > 0) {
            setHoveredOption({ item: options[0], isHovered: true });
            optionsRef.current[0].scrollIntoView({
              behavior: "smooth",
            });
            return;
          }
          if (e.key === "ArrowUp" && !hoveredOption && options.length > 0) {
            setHoveredOption({
              item: options[options.length - 1],
              isHovered: true,
            });
            optionsRef.current[options.length - 1].scrollIntoView({
              behavior: "smooth",
            });
            return;
          }

          const currentItem = options.findIndex(
            (option) => option === hoveredOption?.item
          );
          const navigateToItem =
            e.key === "ArrowDown"
              ? options[currentItem + 1]
              : options[currentItem - 1];
          if (navigateToItem) {
            setHoveredOption({ item: navigateToItem, isHovered: true });
            optionsRef.current[currentItem].scrollIntoView({
              behavior: "smooth",
            });
            return;
          }
        }
        if (e.key === "Escape") callbacks.onDropdown(false);
        if (e.key === "Enter" && hoveredOption)
          callbacks.onSelect(hoveredOption.item);
      },
      [options, hoveredOption]
    ),
  };

  useClickOutside(selectRef, () => setIsOpen(false));

  // Инициализация опций по value
  useInit(() => {
    setSelectedOptions(props.value);
  }, [props.value]);

  useInit(() => {
    setHoveredOption(undefined);
  }, [isOpen]);

  // Фильтр по поиску
  useEffect(() => {
    setOptions(
      props.options.filter((item) =>
        item.title.toLocaleLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [props.options, setOptions, searchValue]);


  // Отслеживание scroll для отображения dropdown
  useEffect(() => {
    document.addEventListener("scroll", callbacks.handleScroll);
    return () => {
      document.removeEventListener("scroll", callbacks.handleScroll);
    };
  }, []);

  return (
    <div className={cn()} ref={selectRef}>
      <div
        className={cn("selectButton", { open: isOpen })}
        onClick={() => callbacks.onDropdown()}
        onKeyUp={callbacks.onKeyDown}
        tabIndex={0}
      >
        <div
          className={cn("selectButton-selectedItems")}
        >
          {(Array.isArray(selectedOptions) ? (
            selectedOptions.length > 0 ? (
              <SelectedOptionsList
                direction={openDirection}
                maxShowOptions={isOpen ? selectedOptions.length : 5}
                options={selectedOptions}
                onSelect={callbacks.onSelect}
                renderOption={props.renderSelectedOption
                  ? props.renderSelectedOption
                  : props.renderOption}
              />
            ) : (
              false
            )
          ) : selectedOptions?.value ? (
            props.renderOption(selectedOptions)
          ) : (
            false
          )) || props.renderOption(props.defaultValue)}
        </div>
        <div
          className={cn("selectButton-arrow", { open: isOpen })}
          onKeyDown={(e) => console.log(e.key)}
        >
          <img src={svgArrow} />
        </div>
      </div>
      {isOpen && (
        <div
          className={cn("optionsWrapper", { direction: openDirection })}
          onKeyDown={callbacks.onKeyDown}
          tabIndex={0}
        >
          <div className={cn("search")}>
            <input
              className={cn("input")}
              placeholder="Поиск"
              onChange={callbacks.onSearch}
              type="string"
              name="search"
              onKeyDown={callbacks.onKeyDown}
            />
          </div>
          <div className={cn("options")}>
            {options.map((item, index) => (
              <div
                key={item.value}
                ref={(e: HTMLDivElement) => (optionsRef.current[index] = e)}
                onMouseEnter={() => setHoveredOption({ item, isHovered: true })}
                // onFocus={() => setHoveredOption({value: item.value, isHovered: true})}
                onMouseLeave={() =>
                  setHoveredOption({ item, isHovered: false })
                }
                onClick={() => {
                  callbacks.onSelect(item);
                }}
              >
                {props.renderOption({
                  ...item,
                  isSelected: Array.isArray(selectedOptions)
                    ? selectedOptions.findIndex(
                        (selectedItem) => selectedItem.value === item.value
                      ) != -1
                    : selectedOptions?.value === item.value,
                  isHover:
                    item == hoveredOption?.item
                      ? hoveredOption.isHovered
                      : false,
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SelectCustom) as <ValueType extends Option>(
  props: ISelectCustomProps<ValueType>
) => JSX.Element;
