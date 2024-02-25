import React, { memo, FC, useRef, useEffect, useState } from "react"
import { cn as bem } from "@bem-react/classname"
import Img from "../../assets/images/chevron_down.png"
import "./style.css"

interface IСountry {
  title: string
  _id: string
  code: string
  selected?: boolean
}

interface ISelectLayout {
  options: IСountry[]
  value: string
  statusOpen: boolean
  openOrCloseSelect: () => void
  onCountry: (_id: string) => void
  onSelected: (_id: string) => void
  input: () => React.ReactNode
  setValue: React.Dispatch<React.SetStateAction<string>>
  setCode: React.Dispatch<React.SetStateAction<string>>
  code: string
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>
  selectedIndex: number | null
  ref: React.MutableRefObject<HTMLInputElement | null>,
  selected: unknown
  setCodes: React.Dispatch<React.SetStateAction<string[]>>
  codes: string[]
  onCodes: (code: string) => void
  setValueInput: React.Dispatch<React.SetStateAction<string>>
}

const SelectLayout: React.ForwardRefExoticComponent<Omit<ISelectLayout, "ref"> & React.RefAttributes<null>> = React.forwardRef((props, ref) => {
  const cn = bem("Select-layout")

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
    selectedIndex,
    selected,
    setCodes,
    codes,
    onCodes,
    setValueInput} = props

  const handleClickOption = (
    id: string,
    title: string,
    code: string,
  ) => {
    setValueInput('')
    console.log('codes.length', codes.length)
    if(codes.length > 0) {
      setValue('Выбранные страны')
    } else {
      setValue(title)
    }
    setCode(code)
    const selectedId = selected as React.MutableRefObject<string[]>
    
    if(!selectedId.current.includes(id)) {
      selectedId.current = [...selectedId.current, id]
    } else selectedId.current = selectedId.current.filter(item => item !== id)
    onSelected(id)
    onCountry(id)
    
    if(!codes.includes(code)) {
      setCodes([...codes, code])
    }else {
      const filterCodes = codes.filter(item => item !== code)
      setCodes(filterCodes)
    }
  };

  const comparison = (index: number) => {
    if (index === selectedIndex) {
      return true;
    } else return false;
  }

  const getSelected = (id: string) => {
    const selectedId = selected as React.MutableRefObject<string[]>
    const status = selectedId.current.includes(id)
    return status
  }

  return (
    <div className={cn()}>
      {statusOpen ? (
        <div className={cn("wrap-list")}>
          <div
            className={cn("input", { select: true })}
            onClick={openOrCloseSelect}
          >
            <div className={cn("wrap-span")}>
              <span className={cn("code", { select: true })}>{value === 'Выбранные страны' ? '' : code}</span>
              <span className={cn("text")}>{codes.length > 0 ? value + '...' : value}</span>
            </div>
            <img
              className={cn("img")}
              src={Img}
              style={statusOpen ? { transform: "rotate(180deg)" } : undefined}
            />
          </div>
          <div className={cn("list-codes")}>
            {codes.length > 1 && codes.map((item) => (
             <span className={cn("code-text")} key={item} onClick={() => onCodes(item)}>{item}</span>
            ))}
          </div>
          <div className={cn("wrap-input")}>{input()}</div>
          <div className={cn("wrap-ul")}>
            <ul className={cn("list")} ref={ref}>
              {options.map((item, index) => (
                <li
                  id={String(index)}
                  className={cn("item", { hover: (comparison(index) && !getSelected(item._id)), selected: getSelected(item._id)})}
                  key={item._id}
                  value={item.title}
                  onClick={() =>
                  handleClickOption(item._id, item.title, item.code)
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
            <span className={cn("code", { select: true })}>{value === 'Выбранные страны' ? '' : code}</span>
            <span className={cn("text")}>{codes.length > 0 ? value + '...' : value}</span>
          </div>
          <img className={cn("img")} src={Img} />
        </div>
      )}
    </div>
  );
});

export default memo(SelectLayout)
