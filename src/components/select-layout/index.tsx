import React, { memo, FC, useRef, useEffect } from "react"
import { cn as bem } from "@bem-react/classname"
import Img from "../../assets/images/chevron_down.png"
import "./style.css"

interface IСountry {
  title: string
  _id: string
  code: string
}

interface ISelectLayout {
  options: IСountry[]
  value: string
  onChange: (value: string | number) => void
  statusOpen: boolean
  openOrCloseSelect: () => void
  onCountry: (_id: string) => void
  input: () => React.ReactNode
  setValue: React.Dispatch<React.SetStateAction<string>>
  setCode: React.Dispatch<React.SetStateAction<string>>
  code: string
  transform: boolean
}

const SelectLayout: FC<ISelectLayout> = ({
  options,
  value,
  onChange,
  statusOpen,
  openOrCloseSelect,
  onCountry,
  setValue,
  setCode,
  input,
  code,
  transform
}) => {
  const cn = bem("Select-layout")

 const handleClickOption = (id: string, title: string, code: string) => {
  onCountry(id)
  openOrCloseSelect()
  setValue(title)
  setCode(code)
 }

  return (
    <div className={cn()}>
      {statusOpen ? (
        <div className={cn("wrap-list")}>
          <div className={cn("input", { select: true })} onClick={openOrCloseSelect}>
            <div className={cn("wrap-span")}>
              <span className={cn("code", { select: true })}>{code}</span>
              <span className={cn("text")}>{value}</span>
            </div>
            <img className={cn("img")} src={Img} style={transform ? {transform: 'rotate(180deg)'} : undefined}/>
          </div>
          <div className={cn("wrap-input")}>{input()}</div>
          <div className={cn("wrap-ul")}>
            <ul className={cn("list")}>
              {options.map((item) => (
                <li className={cn("item")} key={item._id} value={item.title} onClick={() => handleClickOption(item._id, item.title, item.code)}>
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
          <span>{value}</span>
          </div>
          <img className={cn("img")} src={Img} />
        </div>
      )}
    </div>
  )
}

export default memo(SelectLayout)
