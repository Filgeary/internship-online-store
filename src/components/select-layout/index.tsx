import React, { memo, FC } from "react"
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
  handleClick: () => void
  input: () => React.ReactNode
  code: string
}

const SelectLayout: FC<ISelectLayout> = ({
  options,
  value,
  onChange,
  statusOpen,
  handleClick,
  input,
  code,
}) => {
  const cn = bem("Select-layout")

  return (
    <div className={cn()}>
      {statusOpen ? (
        <div className={cn("wrap-list")}>
          <div className={cn("input", { select: true })} onClick={handleClick}>
            <div className={cn("wrap-span")}>
              <span className={cn("code")}>{code}</span>
              <span>{value}</span>
            </div>
            <img className={cn("img")} src={Img} />
          </div>
          <div className={cn("wrap-input")}>{input()}</div>
          <div className={cn("wrap-ul")}>
            <ul className={cn("list")}>
              {options.map((item) => (
                <li className={cn("item")} key={item._id} value={item.title}>
                  <span className={cn("code")}>{item.code}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className={cn("input")} onClick={handleClick}>
          <span>{value}</span>
          <img className={cn("img")} src={Img} />
        </div>
      )}
    </div>
  )
}

export default memo(SelectLayout)
