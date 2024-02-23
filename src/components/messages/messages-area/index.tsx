import './style.css';
import { memo } from 'react';

import Message from '../message';

import { cn as bem } from '@bem-react/classname';
import { useMessagesContext } from '..';

function MessagesArea() {
  const cn = bem('MessagesArea');

  const { messages, userId } = useMessagesContext();

  console.log('@', messages, userId);

  return (
    <div className={cn()}>
      {messages.map((message) => (
        <Message
          key={message._id}
          message={message}
          me={message.author._id === userId}
          sended={true}
          viewed={true}
        />
      ))}
    </div>
  );
}

export default memo(MessagesArea);
