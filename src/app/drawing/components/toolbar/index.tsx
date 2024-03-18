import React, {memo, useEffect, useState} from 'react'
import {cn as bem} from '@bem-react/classname'
import { StoreState } from "@src/store/types"
import useStore from "@src/hooks/use-store"
import useSelector from "@src/hooks/use-selector"
import './style.css'
import Brush from '../../tools/brush'
import Rectangle from '../../tools/rectangle'
import Circle from '../../tools/circle'
import Eraser from '../../tools/eraser'
import Line from '../../tools/line'
import Pointer from '../../tools/pointer'

const Toolbar: React.FC = () => {

    const store = useStore()
    const cn = bem('Toolbar')

    const [nameTool, setNameTool] = useState('freeDraw')

    const select = useSelector((state: StoreState) => ({
        canvas: state.canvas.canvas,
        figures: state.canvas.figures
      }));

    const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
      store.actions.canvas.setFillColor(e.target.value)
      store.actions.canvas.setStrokeColor(e.target.value)
    }

    const download = () => {
      const dataUrl = select.canvas!.toDataURL()
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = "canvas.jpg"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
  }

  const onTool = (name: string) => {
    setNameTool(name)
    store.actions.canvas.setFigures()
    if(name === 'freeDraw') store.actions.canvas.setTool(new Brush(select.canvas), 'freeDraw')
    if(name === 'rectangle') store.actions.canvas.setTool(new Rectangle(select.canvas), 'rectangle')
    if(name === 'circle') store.actions.canvas.setTool(new Circle(select.canvas), 'circle')
    if(name === 'eraser') store.actions.canvas.setTool(new Eraser(select.canvas), 'eraser')
    if(name === 'line') store.actions.canvas.setTool(new Line(select.canvas), 'line')
  }

  useEffect(() => {
    if(select.figures.length > 0 && nameTool === "pointer") store.actions.canvas.setTool(new Pointer(select.canvas, select.figures), 'pointer')
  }, [select.figures])

    return (
      <div className={cn()}>
            <span>Инструменты</span>
            <button className={cn('btn', {brush: true})} onClick={() => onTool('freeDraw')}/>
            <button className={cn('btn', {rect: true})} onClick={() => onTool('rectangle')}/>
            <button className={cn('btn', {circle: true})} onClick={() => onTool('circle')}/>
            <button className={cn('btn', {eraser: true})} onClick={() => onTool('eraser')}/>
            <button className={cn('btn', {line: true})} onClick={() => onTool('line')}/>
            <input  className={cn('btn', {color: true})} onChange={e => changeColor(e)} style={{marginLeft:10}} type="color"/>
            <button className={cn('btn', {pointer: true})} onClick={() => onTool('pointer')}/>
            <button className={cn('btn', {undo: true})} onClick={() => store.actions.canvas.undo()}/>
            <button className={cn('btn', {redo: true})} onClick={() => store.actions.canvas.redo()}/>
            <button className={cn('btn', {save: true})}  onClick={() => download()}/>
      </div>
    )
}

export default memo(Toolbar)


