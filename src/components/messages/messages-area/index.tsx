import './style.css';
import { memo } from 'react';

import Message from '../message';

import { cn as bem } from '@bem-react/classname';
import { useMessagesContext } from '..';

function MessagesArea() {
  const cn = bem('MessagesArea');

  const { messages, userId } = useMessagesContext();

  return (
    <div className={cn()}>
      {messages.map((message) => (
        <Message
          key={message._id}
          message={message}
          me={message.author._id === userId}
          sended={message.author._id === userId && message.sended === true}
          exists={
            message.author._id === userId && !message.sended /* Проверка на отсутствие поля */
          }
        />
      ))}
    </div>
  );
}

export default memo(MessagesArea);
