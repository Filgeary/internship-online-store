import './style.css';
import { memo } from 'react';

import Message from '../message';

import { cn as bem } from '@bem-react/classname';

function MessagesArea() {
  const cn = bem('MessagesArea');

  return (
    <div className={cn()}>
      <Message me={false} />
      <Message me={true} sended={true} viewed={true} />
    </div>
  );
}

export default memo(MessagesArea);
