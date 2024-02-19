import {memo, FC} from 'react'
import {cn as bem} from '@bem-react/classname'

import './style.css'

interface IButtonProps {
  value: string
  onClick?: () => void
  closeStyle?: boolean
}
const Button: FC<IButtonProps> = ({ value, onClick = () => {}, closeStyle = false }) =>{
  const cn = bem('Button')
  return (
    <button className={cn({ close: closeStyle })} onClick={onClick}>{value}</button>
  )
}

export default memo(Button)
