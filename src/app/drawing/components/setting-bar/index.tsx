import React, { memo } from "react"
import { cn as bem } from "@bem-react/classname"
import useStore from "@src/hooks/use-store"
import "./style.css"

const SettingBar: React.FC = () => {
  const cn = bem("Setting_bar")

  const store = useStore()

  return (
    <div className={cn()}>
      <label htmlFor="line-width">Толщина линии</label>
      <input
        className={cn('input')}
        onChange={(e) => store.actions.canvas.setLineWidth(Number(e.target.value))}
        id="line-width"
        type="number"
        defaultValue={1}
        min={1}
        max={50}
      />
      <label htmlFor="stroke-color">Цвет обводки</label>
      <input
        className={cn('input', {color: true})}
        onChange={(e) => store.actions.canvas.setStrokeColor(e.target.value)}
        id="stroke-color"
        type="color"
      />
    </div>
  )
}

export default memo(SettingBar)
