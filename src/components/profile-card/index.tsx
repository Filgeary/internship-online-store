import {memo, FC} from "react"
import {cn as bem} from '@bem-react/classname'
import './style.css'

interface IProfileCardProps {
  data: {
    profile: {
      name: string
      phone: string
    }
    email: string
  }
}

const ProfileCard: FC<IProfileCardProps> = ({ data }) => {
  const cn = bem('ProfileCard')

  return (
    <div className={cn()}>
      <h3 className={cn('title')}>Профиль</h3>
      <div className={cn('prop')}>
        <div className={cn('label')}>Имя:</div>
        <div className={cn('value')}>{data?.profile?.name}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Телефон:</div>
        <div className={cn('value')}>{data?.profile?.phone}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>email:</div>
        <div className={cn('value')}>{data?.email}</div>
      </div>
    </div>
  )
}

export default memo(ProfileCard)
