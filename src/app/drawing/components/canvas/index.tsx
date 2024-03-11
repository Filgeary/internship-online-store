import React, { memo } from "react"
import {cn as bem} from '@bem-react/classname'
import './style.css'

const Canvas: React.FC = () => {
  const cn = bem('Canvas')
  return (
    <div className={cn()}>
        <canvas width={600} height={400}></canvas>
    </div>
  )
}

export default memo(Canvas)
