import { TMadeIn } from "@src/store/article/types";
import ItemSelect from "../item-select";
import "./style.css";
import { cn as bem } from "@bem-react/classname";
import { Key, SetStateAction, memo, useRef, useState } from "react";

type Props = {
  options: TMadeIn[];
  value: any;
  onSelect: (e: any) => void;
};

function SelectBox(props: Props) {
  const cn = bem("SelectBox");
  const [open, setOpen] = useState<boolean>();
  const [item, setItem] = useState<any>({ title: "Все", code: "" });
  const [search, setSearch] = useState<string>("");

  const countries = props.options.filter((el) =>
    el.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const arrowRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setOpen(!open);
    arrowRef.current?.classList.add("arrowUp");
  };

  const onSearchCountry = (e: { target: { value: any } }) => {
    setSearch(e.target.value);
  };

  
  return (
    <div className={cn()}>
      <div className={cn("select")} onClick={handleClick}>
        <div className={cn("group")}>
          <div className={cn("flag")}>{item.code}</div>
          <div className={cn("country")}>{item.title}</div>
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
            onChange={onSearchCountry}
          />
          <div className={cn("box")}>
            {countries ? (
              countries.map((el: { _id: Key | null | undefined }) => (
                <ItemSelect
                  key={el._id}
                  item={el}
                  selected={item}
                  onSelect={props.onSelect}
                  onSetItem={setItem}
                />
              ))
            ) : (
              <div>Ничего не найдено!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SelectBox);
