import './style.css';
import { memo, useEffect, useRef, useState } from 'react';

import { cn as bem } from '@bem-react/classname';

import Message from '../message';

import { useMessagesContext } from '..';

function MessagesArea() {
  const cn = bem('MessagesArea');

  const messagesAreaRef = useRef<HTMLDivElement | null>(null);

  const [previousHeight, setPreviousHeight] = useState(0);
  const [onTop, setOnTop] = useState(false);

  const { messages, userId, onScrollTop } = useMessagesContext();

  const handlers = {
    onScroll: () => {
      if (messagesAreaRef.current.scrollTop === 0) {
        onScrollTop();
        setOnTop(true);
      } else {
        setOnTop(false);
      }
    },
  };

  useEffect(() => {
    const previousScrollPosition = messagesAreaRef.current.scrollHeight - previousHeight;

    if (onTop) messagesAreaRef.current.scrollTop = previousScrollPosition;
    else messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;

    setPreviousHeight(messagesAreaRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className={cn()} ref={messagesAreaRef} onScroll={handlers.onScroll}>
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
