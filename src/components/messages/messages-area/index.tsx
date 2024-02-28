import './style.css';
import { memo, useEffect, useRef, useState } from 'react';

import { cn as bem } from '@bem-react/classname';

import Message from '../message';

import { useMessagesContext } from '..';

function MessagesArea() {
  const cn = bem('MessagesArea');

  const messagesAreaRef = useRef<HTMLDivElement | null>(null);

  const [previousHeight, setPreviousHeight] = useState(0);

  const { messages, userId, onScrollTop } = useMessagesContext();

  // +5, т.к. значения не всегда будут идеально совпадать
  const scrollingNow =
    messagesAreaRef.current?.scrollHeight >
    messagesAreaRef.current?.clientHeight + messagesAreaRef.current?.scrollTop + 5;

  const handlers = {
    onScroll: () => {
      if (messagesAreaRef.current.scrollTop === 0) onScrollTop();
    },
  };

  useEffect(() => {
    const previousScrollPosition = messagesAreaRef.current.scrollHeight - previousHeight;

    if (scrollingNow) messagesAreaRef.current.scrollTop = previousScrollPosition;
    else messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;

    setPreviousHeight(messagesAreaRef.current.scrollHeight);
  }, [messages, scrollingNow]);

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
