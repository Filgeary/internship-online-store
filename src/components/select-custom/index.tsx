import ItemSelect from "../item-select";
import { cn as bem } from "@bem-react/classname";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { TCountries } from "@src/store/countries";
import Spinner from "../spinner";
import "./style.css";
import useInit from "@src/hooks/use-init";

type Props = {
  options: TCountries[];
  selected: TCountries[];
  onSearch: (value: string) => void;
  onLoad: () => void;
  waiting: boolean;
  onSelectCountry: (item: TCountries) => void;
  onReset: () => void;
  onSelect: (id: string[]) => void;
};

function SelectCustom({
  options,
  selected,
  onSearch,
  waiting,
  onLoad,
  onSelectCountry,
  onReset,
  onSelect,
}: Props) {
  const cn = bem("SelectCustom");
  const [open, setOpen] = useState<boolean>();
  const [search, setSearch] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);

  const refOptions = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const refScrollList = useRef<HTMLDivElement | null>(null);
  const refDropdown = useRef<HTMLDivElement | null>(null);
  const refSelect = useRef<Array<HTMLDivElement | null>>([]);

  useInit(() => {
    if (typeof document !== 'undefined') {
      const html = document.querySelector("html");
      if (html) {
        html.style.overflow = open ? "hidden" : "auto";
      }
    }
    if (
      refOptions.current !== null &&
      refDropdown.current !== null &&
      window.innerHeight -
        refOptions.current.offsetTop +
        refOptions.current.offsetHeight <
        refDropdown.current?.scrollHeight
    ) {
      refDropdown.current?.classList.replace("top", "bottom");
    } else {
      refDropdown.current?.classList.replace("bottom", "top");
    }
  }, [open]);

  useInit(() => {
    if (selected.length > 0) {
      onSelect(selected.map((el) => el._id));
    }
  }, [selected]);

  const callbacks = {
    onReset: useCallback(() => onReset(), [selected]),
    onScroll: useCallback(() => {
      if (
        refScrollList.current!.scrollHeight ===
          refScrollList.current!.scrollTop +
            refScrollList.current!.clientHeight &&
        search.length === 0
      ) {
        onLoad();
      }
    }, [options, refScrollList.current]),

    onSearchCountries: (e: {
      target: { value: string };
      preventDefault: () => void;
    }) => {
      setSearch(e.target.value.trim());
      onSearch(e.target.value.trim());
      e.preventDefault();
    },

    onOpen: useCallback(() => {
      setOpen(!open);
    }, [open]),

    onCloseSelect: (e: { stopPropagation?: any; key?: any }) => {
      const currentItem = options.findIndex((el) => el._id === hovered);
      e.stopPropagation();
      const { key } = e;
      if (key === "Escape" || key === "Tab") {
        setOpen(false);
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.stopPropagation();
        if (e.key === "ArrowDown" && hovered === null) {
          setHovered(options[0]._id);
          return;
        }
        const nextItem =
          e.key === "ArrowDown"
            ? options[currentItem + 1]
            : options[currentItem - 1];
        if (nextItem) {
          setHovered(nextItem._id);
          refSelect.current[currentItem]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          });
          return;
        }
      } else if (e.key === "Enter" && hovered !== null) {
        if (options[currentItem]?.title === "Все") {
          onReset();
        } else {
          callbacks.onSelectCountries(options[currentItem]);
        }
      }
    },

    onClose: useCallback(() => {
      setOpen(false);
    }, [open]),

    onSelectCountries: useCallback(
      (item: TCountries) => {
        if (selected.length === 1 && selected[0]._id === item._id) {
          onSelectCountry(item);
          onSelect([]);
        } else {
          onSelectCountry(item);
        }
      },
      [selected]
    ),

    onOpenSelect: (e: any) => {
      e.stopPropagation();
      const { key } = e;
      if (key === "Enter") {
        setOpen(true);
      }
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
  })(refOptions, callbacks.onClose);

  return (
    <div className={cn()} ref={refOptions}>
      <div
        className={cn("select")}
        onClick={callbacks.onOpen}
        tabIndex={0}
        onKeyDown={callbacks.onOpenSelect}
      >
        {selected.length === 1 ? (
          <ItemSelect
            key={selected[0]?._id}
            item={selected[0]}
            selected={selected}
          />
        ) : selected.length > 1 ? (
          <ItemSelect
            key={selected[0]?._id}
            item={selected[0]}
            selected={selected}
            count={`+${selected.length - 1}`}
          />
        ) : (
          <ItemSelect
            key={options[0]?._id}
            item={options[0]}
            selected={selected}
          />
        )}
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
        <div
          className={cn("dropdown") + " " + "top"}
          tabIndex={0}
          onKeyDown={callbacks.onCloseSelect}
          ref={refDropdown}
        >
          <div className={cn("selected")}>
            {selected.slice(1).map((el) => (
              <div onClick={() => callbacks.onSelectCountries(el)} key={el._id}>
                <ItemSelect item={el} selected={selected} selectedList={true} />
              </div>
            ))}
          </div>
          <div className={cn("content")}>
            <input
              type="text"
              className={cn("search")}
              placeholder="Поиск"
              onChange={callbacks.onSearchCountries}
              value={search}
              autoFocus
              ref={refInput}
            />
            <div
              className={cn("box")}
              ref={refScrollList}
              onScroll={callbacks.onScroll}
            >
              <Spinner active={waiting}>
                {options &&
                  options.map((el, i) => (
                    <div
                      key={el._id}
                      ref={(e) => (refSelect.current[i] = e)}
                      onClick={
                        el.title === "Все"
                          ? () => onReset()
                          : () => callbacks.onSelectCountries(el)
                      }
                    >
                      <ItemSelect
                        item={el}
                        selected={selected}
                        hovered={hovered}
                      />
                    </div>
                  ))}
              </Spinner>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SelectCustom);
