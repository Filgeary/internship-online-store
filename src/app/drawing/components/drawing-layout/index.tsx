import React, { memo, ReactNode } from "react"
import {cn as bem} from '@bem-react/classname'
import './style.css'

interface IDrawingLayout {
    children: ReactNode
  }

const DrawingLayout: React.FC<IDrawingLayout> = ({children}) => {
  const cn = bem('Drawing_layout')
  return (
    <div className={cn()}>
        {children}
    </div>
  )
}

export default memo(DrawingLayout)