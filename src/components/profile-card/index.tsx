import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';

type ProfileCardProps = {
  data: any;
};

function ProfileCard({data}: ProfileCardProps) {
  const cn = bem('ProfileCard');

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

export default memo(ProfileCard);
