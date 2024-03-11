import React, {memo} from 'react'
import {cn as bem} from '@bem-react/classname'
import './style.css'

const Toolbar: React.FC = () => {
    const cn = bem('Toolbar')

    const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    }

    return (
      <div className={cn()}>
            <button className={cn('btn', {brush: true})} onClick={() => {}}/>
            <button className={cn('btn', {rect: true})} onClick={() => {}}/>
            <button className={cn('btn', {circle: true})} onClick={() => {}}/>
            <button className={cn('btn', {eraser: true})} onClick={() => {}}/>
            <button className={cn('btn', {line: true})} onClick={() => {}}/>
            <input onChange={e => changeColor(e)} style={{marginLeft:10}} type="color" value="#e66465"/>
            <button className={cn('btn', {undo: true})} onClick={() => {}}/>
            <button className={cn('btn', {redo: true})} onClick={() => {}}/>
            <button className={cn('btn', {save: true})}  onClick={() => {}}/>
      </div>
    )
}

export default memo(Toolbar)


