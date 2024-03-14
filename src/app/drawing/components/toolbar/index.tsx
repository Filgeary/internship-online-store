import React, {memo} from 'react'
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

const Toolbar: React.FC = () => {

    const store = useStore()
    const cn = bem('Toolbar')

    const select = useSelector((state: StoreState) => ({
        canvas: state.canvas.canvas
      }));


    const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
      store.actions.canvas.setFillColor(e.target.value)
      store.actions.canvas.setStrokeColor(e.target.value)
    }

    const download = () => {
      const dataUrl = select.canvas!.toDataURL()
      console.log(dataUrl)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = "canvas.jpg"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
  }
    console.log('select.canvas!', select.canvas!)
    return (
      <div className={cn()}>
            <span>Инструменты</span>
            <button className={cn('btn', {brush: true})} onClick={() => store.actions.canvas.setTool(new Brush(select.canvas))}/>
            <button className={cn('btn', {rect: true})} onClick={() => store.actions.canvas.setTool(new Rectangle(select.canvas))}/>
            <button className={cn('btn', {circle: true})} onClick={() => store.actions.canvas.setTool(new Circle(select.canvas))}/>
            <button className={cn('btn', {eraser: true})} onClick={() => store.actions.canvas.setTool(new Eraser(select.canvas))}/>
            <button className={cn('btn', {line: true})} onClick={() => store.actions.canvas.setTool(new Line(select.canvas))}/>
            <input  className={cn('btn', {color: true})} onChange={e => changeColor(e)} style={{marginLeft:10}} type="color"/>
            <button className={cn('btn', {undo: true})} onClick={() => store.actions.canvas.undo()}/>
            <button className={cn('btn', {redo: true})} onClick={() => store.actions.canvas.redo()}/>
            <button className={cn('btn', {save: true})}  onClick={() => download()}/>
      </div>
    )
}

export default memo(Toolbar)


