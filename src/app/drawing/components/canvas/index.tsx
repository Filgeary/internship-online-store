import React, { memo, useEffect, useRef } from "react"
import {cn as bem} from '@bem-react/classname'
import useStore from "@src/hooks/use-store" 
import './style.css'
import Brush from "../../tools/brush"

const Canvas: React.FC = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const store = useStore()
  const cn = bem('Canvas')

  const mouseDownHandler = () => {
    canvasRef.current && store.actions.canvas.pushToUndo(canvasRef.current.toDataURL())
}

  useEffect(() => {
    canvasRef.current && store.actions.canvas.setCannvas(canvasRef.current)
    store.actions.canvas.setTool(new Brush(canvasRef.current))
  }, [])

  return (
    <div className={cn()}>
        <canvas onMouseDown={() => mouseDownHandler()} width={600} height={400} ref={canvasRef}></canvas>
    </div>
  )
}

export default memo(Canvas)
