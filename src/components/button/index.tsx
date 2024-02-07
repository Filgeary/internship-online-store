import {memo, FC} from 'react'
import {cn as bem} from '@bem-react/classname'

import './style.css'

interface IButtonProps {
  value: string
  onClick?: () => void
}
const Button: FC<IButtonProps> = ({ value, onClick = () => {} }) =>{
  const cn = bem('Button')
  return (
    <button className={cn()} onClick={onClick}>{value}</button>
  )
}

export default memo(Button)
