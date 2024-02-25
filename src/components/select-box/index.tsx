import { TMadeIn } from "@src/store/article/types";
import ItemSelect from "../item-select";
import "./style.css";
import { cn as bem } from "@bem-react/classname";
import {
  Key,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useStore from "@src/hooks/use-store";
import { TItem } from "@src/store/catalog/types";
import { TCountries } from "@src/store/countries";
import Input from "../input";
import Spinner from "../spinner";

type Props = {
  options: TCountries[];
  value: string | null;
  onSelect: (id: string) => void;
  onSearch: (value: string) => void;
  waiting: boolean;
};

function SelectBox({ options, value, onSelect, onSearch, waiting }: Props) {
  const store = useStore();
  const cn = bem("SelectBox");

  const [open, setOpen] = useState<boolean>();
  const [search, setSearch] = useState<string>("");
  const [item, setItem] = useState<any>({ title: "Все", code: "" });

  const arrowRef = useRef<HTMLDivElement>(null);
  const selectBox = useRef<HTMLDivElement>(null);
  const selectItem = useRef<HTMLInputElement>(null);

  const useClickOutside = (ref: React.RefObject<any>, handler: Function) => {
    useEffect(() => {
      const listener = (event: Event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler();
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  const handleClick = () => {
    setOpen(!open);
    arrowRef.current?.classList.add("arrowUp");
  };

  const onSearchCountries = (e: {
    target: { value: string };
    preventDefault: () => void;
  }) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
    e.preventDefault();
  };

  const resetSearch = () => {
    setSearch("");
    onSearch("");
    setOpen(!open);
  };

  const onSelectCountries = (id: string) => {
    onSelect(id);
    resetSearch();
  };

  const openSelect = (e: { stopPropagation?: any; key?: any }) => {
    e.stopPropagation();
    const { key } = e;
    if (key === "Enter") {
      handleClick();
    }
  };

  const closeSelect = (e: { stopPropagation?: any; key?: any }) => {
    e.stopPropagation();
    const { key } = e;
    if (key === "Escape" || key === "Tab") {
      setOpen(!open);
    } else if (key === "ArrowDown") {
     
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  useClickOutside(selectBox, handleClose);
  return (
    <div className={cn()} ref={selectBox}>
      <div
        className={cn("select")}
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={openSelect}
      >
        <div className={cn("group")}>
          <div className={cn("flag")}>{item.code}</div>
          <div className={cn("country")}>
            {item.title.length <= 21
              ? item.title
              : `${item.title.substring(0, 21)}...`}
          </div>
        </div>
        <div
          className={
            open ? cn("arrow") + " " + "arrowUp" : cn("arrow") + " " + {}
          }
          ref={arrowRef}
        >
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08925L6.58928 7.08925C6.26384 7.41468 5.7362 7.41468 5.41076 7.08925L0.410765 2.08925C0.0853278 1.76381 0.0853278 1.23617 0.410765 0.910734Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
      {open && (
        <div className={cn("content")}>
          <input
            type="text"
            className={cn("search")}
            placeholder="Поиск"
            onChange={onSearchCountries}
            onKeyDown={closeSelect}
            value={search}
            autoFocus
            ref={selectItem}
          />
          <div className={cn("box")}>
            <Spinner active={waiting}>
              {options &&
                options.map((el: { _id: Key | null | undefined }) => (
                  <ItemSelect
                    key={el._id}
                    item={el}
                    selected={item}
                    onSelect={onSelectCountries}
                    onSetItem={setItem}
                  />
                ))}
            </Spinner>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SelectBox);
