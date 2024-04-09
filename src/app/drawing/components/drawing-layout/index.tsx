import React, { memo, ReactNode } from "react"
import {cn as bem} from '@bem-react/classname'
import './style.css'

interface IDrawingLayout {
    children: ReactNode
    onMessage: () => void
    result: number | null
  }

const DrawingLayout: React.FC<IDrawingLayout> = ({children, onMessage, result}) => {
  const cn = bem('Drawing_layout')
  return (
    <>
    <div className={cn()}>
        {children}
    </div>
    <div className={cn('animation_block')}>
      <div className={cn('block')}>
        <p></p>
      </div>
      <button className={cn('button')} onClick={onMessage}>Тестирование Web Worker</button>
      <p>Результат вычисления: <strong>{result}</strong></p>
    </div>
    </>
  )
}

export default memo(DrawingLayout)