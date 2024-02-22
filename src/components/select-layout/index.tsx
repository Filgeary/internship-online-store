import React, { memo, FC, useRef, useEffect, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import Img from "../../assets/images/chevron_down.png";
import "./style.css";
import { number } from "prop-types";

interface IСountry {
  title: string;
  _id: string;
  code: string;
  selected?: boolean
}

interface ISelectLayout {
  options: IСountry[];
  value: string;
  statusOpen: boolean;
  openOrCloseSelect: () => void;
  onCountry: (_id: string) => void;
  onSelected: (_id: string) => void;
  input: () => React.ReactNode;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  code: string;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
  selectedIndex: number
  ref: React.MutableRefObject<null>
}

const SelectLayout: React.ForwardRefExoticComponent<Omit<ISelectLayout, "ref"> & React.RefAttributes<null>> = React.forwardRef((props, ref) => {
  const cn = bem("Select-layout");

  const {options,
    value,
    statusOpen,
    openOrCloseSelect,
    onCountry,
    setValue,
    setCode,
    input,
    code,
    setSelectedIndex,
    onSelected,
    selectedIndex} = props

  const handleClickOption = (
    id: string,
    title: string,
    code: string,
    index: number
  ) => {
    onCountry(id);
    setValue(title);
    setCode(code);
    setSelectedIndex(index);
    onSelected(id)
  };

  const comparison = (index: number) => {
    if (index === selectedIndex) {
      return true;
    } else return false;
  };

  return (
    <div className={cn()}>
      {statusOpen ? (
        <div className={cn("wrap-list")}>
          <div
            className={cn("input", { select: true })}
            onClick={openOrCloseSelect}
          >
            <div className={cn("wrap-span")}>
              <span className={cn("code", { select: true })}>{code}</span>
              <span className={cn("text")}>{value}</span>
            </div>
            <img
              className={cn("img")}
              src={Img}
              style={statusOpen ? { transform: "rotate(180deg)" } : undefined}
            />
          </div>
          <div className={cn("wrap-input")}>{input()}</div>
          <div className={cn("wrap-ul")}>
            <ul className={cn("list")} ref={ref}>
              {options.map((item, index) => (
                <li
                  className={cn("item", { hover: comparison(index), selected: item.selected})}
                  key={item._id}
                  value={item.title}
                  onClick={() =>
                    handleClickOption(item._id, item.title, item.code, index)
                  }
                >
                  <span className={cn("code")}>{item.code}</span>
                  <span className={cn("text")}>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className={cn("input")} onClick={openOrCloseSelect}>
          <div className={cn("wrap-span")}>
            <span className={cn("code", { select: true })}>{code}</span>
            <span className={cn("text")}>{value}</span>
          </div>
          <img className={cn("img")} src={Img} />
        </div>
      )}
    </div>
  );
});

export default memo(SelectLayout);
