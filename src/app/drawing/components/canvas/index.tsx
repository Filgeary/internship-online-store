import React, { memo, useEffect, useRef } from "react"
import {cn as bem} from '@bem-react/classname'
import useSelector from "@src/hooks/use-selector"
import useStore from "@src/hooks/use-store" 
import './style.css'
import Brush from "../../tools/brush"
import Rectangle from "../../tools/rectangle"
import { StoreState } from "@src/store/types"

const Canvas: React.FC = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const store = useStore()
  const cn = bem('Canvas')

  const select = useSelector((state: StoreState) => ({
    figures: state.canvas.tool
  }));

  const mouseDownHandler = () => {
    if(canvasRef.current) {
      // const rect = canvasRef.current.getBoundingClientRect()
      // console.log('rect', rect)
      store.actions.canvas.pushToUndo(canvasRef.current.toDataURL())
      //  const rectangle = Rectangle
      //  console.log(rectangle.prototype)
    }
}

  useEffect(() => {
    canvasRef.current && store.actions.canvas.setCannvas(canvasRef.current)
    store.actions.canvas.setTool(new Brush(canvasRef.current), 'freeDraw')
  }, [])

  return (
    <div className={cn()}>
        <canvas onMouseDown={() => mouseDownHandler()} width={600} height={400} ref={canvasRef}></canvas>
    </div>
  )
}

export default memo(Canvas)
