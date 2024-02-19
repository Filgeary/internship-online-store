import { useEffect, useRef, useState } from "react";
import "./style.css";
import { ArrowDown } from "../icons/arrow-down";
import { ArrowUp } from "../icons/arrow-up";
import useStore from "@src/hooks/use-store";

type Option = {
  title: string;
  shortcut?: string;
  value: string;
};

type SelectProps = {
  selected: Option["value"] | null;
  options: Option[];
  placeholder?: string;
  onChange?: (selected: Option["value"]) => void;
  onClose?: () => void;
};

function SelectCustom({ selected, options, onChange }: SelectProps) {
  const store = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((el) => {
    el.value === selected && console.log(el);
    return el.value === selected;
  });

  const onOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
    !isOpen && store.actions.countries.load();
  };

  const onClose = () => {
    setIsOpen(false);
    setSearch("");
  };

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

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { target } = event;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        onClose();
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <div className="SelectCustom" ref={rootRef}>
      <div className="SelectCustom-container">
        <div
          className="SelectCustom-selected"
          onClick={(event) => onOpen(event)}
        >
          <div className="SelectCustom-shortcut">
            {selectedOption?.shortcut}
          </div>
          <div className="SelectCustom-title">{selectedOption?.title}</div>
          <div className="SelectCustom-arrow">
            {isOpen ? <ArrowUp /> : <ArrowDown />}
          </div>
        </div>
        {isOpen && (
          <div className="SelectCustom-menu">
            <input
              value={search}
              onChange={(e) => onSearch(e)}
              placeholder="Поиск"
              className="SelectCustom-search"
            ></input>
            <div className="SelectCustom-options">
              {filteredOptions.length > 2 &&
                filteredOptions.map((el) => {
                  return (
                    <div
                      title={el.title}
                      className={
                        el.value === selectedOption.value
                          ? "SelectCustom-option-selected"
                          : "SelectCustom-option"
                      }
                      onClick={() => {
                        onClose();
                        onChange(el.value);
                      }}
                    >
                      <div className="SelectCustom-shortcut">
                        {el?.shortcut}
                      </div>
                      <div className="SelectCustom-title">{el?.title}</div>
                    </div>
                  );
                })}
              {!filteredOptions.length && <div>Не найдено</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectCustom;
