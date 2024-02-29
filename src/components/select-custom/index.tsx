import ItemSelect from "../item-select";
import "./style.css";
import { cn as bem } from "@bem-react/classname";
import { memo, useEffect, useRef, useState } from "react";
import useStore from "@src/hooks/use-store";
import { TCountries } from "@src/store/countries";
import Spinner from "../spinner";
import useInit from "@src/hooks/use-init";

type Props = {
  options: TCountries[];
  selected: TCountries[];
  onSelect: (id: string[]) => void;
  onSearch: (value: string) => void;
  onLoad: () => void;
  waiting: boolean;
  onSelectCountry: (item: TCountries) => void;
  onReset: () => void;
};

function SelectCustom({
  options,
  selected,
  onSelect,
  onSearch,
  waiting,
  onLoad,
  onSelectCountry,
  onReset,
}: Props) {
  const store = useStore();
  const cn = bem("SelectBox");
  const [scroll, setScroll] = useState(true);
  const [open, setOpen] = useState<boolean>();
  const [search, setSearch] = useState<string>("");

  const selectBox = useRef<HTMLDivElement>(null);
  const selectItem = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrollHeightSelect, setScrollHeightSelect] = useState<number>(0);

  useInit(() => {
    onSelect(selected.map((el) => el._id));
  }, [selected]);
  useInit(() => {
    if (scroll) {
      scrollRef.current?.scrollTo(0, scrollHeightSelect - 120);
    }
  }, [options]);

  const callbacks = {
    onScroll: () => {
      if (
        scrollRef.current!.scrollHeight -
          scrollRef.current!.scrollTop -
          scrollRef.current!.clientHeight <
          1 &&
        search.length < 1
      ) {
        onLoad();
        setScrollHeightSelect(scrollRef.current!.scrollHeight);
      }
    },
    onSearchCountries: (e: {
      target: { value: string };
      preventDefault: () => void;
    }) => {
      setSearch(e.target.value);
      onSearch(e.target.value);
      e.preventDefault();
    },
    onOpenSelect: (e: { stopPropagation?: any; key?: any }) => {
      e.stopPropagation();
      const { key } = e;
      if (key === "Enter") {
        setOpen(true);
      }
    },
    onOpen: () => {
      setOpen(!open);
    },
    onCloseSelect: (e: { stopPropagation?: any; key?: any }) => {
      e.stopPropagation();
      const { key } = e;
      if (key === "Escape" || key === "Tab") {
        setOpen(false);
      }
    },
    onClose: () => {
      setOpen(false);
    },
    onSelectCountries: (item: TCountries) => {
      onSelectCountry(item);
    },
  };

  (function (ref: React.RefObject<any>, handler: Function) {
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
  })(selectBox, callbacks.onClose);
  return (
    <div className={cn()} ref={selectBox}>
      <div
        className={cn("select")}
        onClick={callbacks.onOpen}
        tabIndex={0}
        onKeyDown={callbacks.onOpenSelect}
      >
        <div className={cn("group")}>
          {/* <div className={cn("flag")}>{item.code}</div>
          <div className={cn("country")}>
            {item.title.length <= 21
              ? item.title
              : `${item.title.substring(0, 21)}...`}
          </div> */}
        </div>
        <div
          className={
            open ? cn("arrow") + " " + "arrowUp" : cn("arrow") + " " + {}
          }
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
            onChange={callbacks.onSearchCountries}
            onKeyDown={callbacks.onCloseSelect}
            value={search}
            autoFocus
            ref={selectItem}
          />
          <div
            className={cn("box")}
            onScroll={callbacks.onScroll}
            ref={scrollRef}
          >
            <Spinner active={waiting}>
              {options &&
                options.map((el) => (
                  <ItemSelect
                    key={el._id}
                    item={el}
                    onSelect={callbacks.onSelectCountries}
                    onReset={onReset}
                  />
                ))}
            </Spinner>
            <div ref={ref} />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SelectCustom);
