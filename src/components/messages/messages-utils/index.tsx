import './style.css';

import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';
import { useMessagesContext } from '..';

function MessagesUtils() {
  const cn = bem('MessagesUtils');

  const { onBottom, messagesAreaRef } = useMessagesContext();

  const handlers = {
    onClick: () => {
      messagesAreaRef.current.scrollTo({
        top: messagesAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    },
  };

  return (
    <div className={cn()}>
      <div className={cn('inner')}>
        <button disabled={onBottom} className={cn('action')} onClick={handlers.onClick}>
          К низу
        </button>
      </div>
    </div>
  );
}

export default memo(MessagesUtils);
