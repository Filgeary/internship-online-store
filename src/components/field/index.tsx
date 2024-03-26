import {memo, ReactNode, FC} from "react"
import {cn as bem} from '@bem-react/classname'
import './style.css'

interface IFieldProps {
  label?: ReactNode
  error?: ReactNode
  children?: ReactNode
}

const Field: FC<IFieldProps> = ({ label, error, children }) =>{
  const cn = bem('Field')
  return (
    <div className={cn()}>
      <label className={cn('label')}>{label}</label>
      <div className={cn('input')}>
        {children}
      </div>
      <div className={cn('error')}>
        {error}
      </div>
    </div>
  )
}

export default memo(Field)
