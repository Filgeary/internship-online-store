import { cn as bem } from '@bem-react/classname';
import type { IUserProfile } from '@src/types/IUserProfile';
import { memo } from 'react';

import './style.css';

type Props = {
  data: IUserProfile | null;
};

function ProfileCard({ data }: Props) {
  const cn = bem('ProfileCard');

  if (!data) {
    return null;
  }

  return (
    <div className={cn()}>
      <h3 className={cn('title')}>Профиль</h3>
      <div className={cn('prop')}>
        <div className={cn('label')}>Имя:</div>
        <div className={cn('value')}>{data.profile?.name}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Телефон:</div>
        <div className={cn('value')}>{data.profile?.phone}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>email:</div>
        <div className={cn('value')}>{data.email}</div>
      </div>
    </div>
  );
}

export default memo(ProfileCard);
