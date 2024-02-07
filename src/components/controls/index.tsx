import {memo, FC} from "react"
import './style.css'

interface IControlsProps {
  onAdd: () => void
}
const Controls: FC<IControlsProps> = ({ onAdd }) => {
  return (
    <div className='Controls'>
      <button onClick={() => onAdd()}>Добавить</button>
    </div>
  )
}

export default memo(Controls)
