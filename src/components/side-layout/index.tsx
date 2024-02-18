import React, { FC, ReactNode, memo } from 'react'
import {cn as bem} from '@bem-react/classname'
import './style.css'

interface SideLayoutProps {
  children: ReactNode
  side?: 'start' | 'end' | 'between'
  padding?: 'small' | 'medium'
  align?: 'start' | 'end'
}

const SideLayout: FC<SideLayoutProps> = ({ children, side, padding, align }) => {
  const cn = bem('SideLayout');
  return (
    <div className={cn({side, padding, align})}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={cn('item')}>{child}</div>
      ))}
    </div>
  )
}

export default memo(SideLayout)
