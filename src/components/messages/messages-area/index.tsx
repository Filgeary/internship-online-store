import './style.css';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cn as bem } from '@bem-react/classname';

import Message from '../message';

import { useMessagesContext } from '..';

function MessagesArea() {
  const cn = bem('MessagesArea');

  const [previousHeight, setPreviousHeight] = useState(0);
  const [onTop, setOnTop] = useState(false);
  const [initScrolling, setInitScrolling] = useState(false);

  const { messages, userId, onScrollTop, setOnBottom, messagesAreaRef } = useMessagesContext();

  const handlers = {
    onScroll: () => {
      if (messagesAreaRef.current.scrollTop === 0) {
        onScrollTop();
        setOnTop(true);
      } else {
        setOnTop(false);
      }

      if (
        messagesAreaRef.current.scrollTop + messagesAreaRef.current.clientHeight + 5 >=
        messagesAreaRef.current.scrollHeight
      ) {
        setOnBottom(true);
      } else {
        setOnBottom(false);
      }
    },
  };

  useLayoutEffect(() => {
    const previousScrollPosition = messagesAreaRef.current.scrollHeight - previousHeight;
    const lastMessageAuthorId = messages.at(-1)?.author._id;

    const scrollableDistance =
      messagesAreaRef.current.scrollTop + messagesAreaRef.current.clientHeight;
    const scrollingNow = messagesAreaRef.current.scrollHeight === scrollableDistance;

    if (onTop) {
      messagesAreaRef.current.scrollTop = previousScrollPosition;
    } else if (!scrollingNow || lastMessageAuthorId === userId) {
      messagesAreaRef.current.scrollTo({
        top: messagesAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }

    setPreviousHeight(messagesAreaRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    if (initScrolling || messages.length === 0) return;
    messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    setInitScrolling(true);
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
