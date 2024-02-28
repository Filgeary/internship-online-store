import './style.css';
import { memo, useEffect, useRef, useState } from 'react';

import { cn as bem } from '@bem-react/classname';

import Message from '../message';

import { useMessagesContext } from '..';

function MessagesArea() {
  const cn = bem('MessagesArea');

  const messagesAreaRef = useRef<HTMLDivElement | null>(null);
  const topIndicatorRef = useRef<HTMLDivElement | null>(null);

  const [previousHeight, setPreviousHeight] = useState(0);

  const { messages, userId, onScrollTop } = useMessagesContext();

  // +5, т.к. значения не всегда будут идеально совпадать
  const scrollingNow =
    messagesAreaRef.current?.scrollHeight >
    messagesAreaRef.current?.clientHeight + messagesAreaRef.current?.scrollTop + 5;

  useEffect(() => {
    const previousScrollPosition = messagesAreaRef.current.scrollHeight - previousHeight;

    if (scrollingNow) messagesAreaRef.current.scrollTop = previousScrollPosition;
    else messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;

    setPreviousHeight(messagesAreaRef.current.scrollHeight);
  }, [messages, scrollingNow]);

  useEffect(() => {
    const topIndicatorNode = topIndicatorRef.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onScrollTop();
        }
      });
    });

    observer.observe(topIndicatorNode);

    return () => observer.unobserve(topIndicatorNode);
  }, []);

  return (
    <div className={cn()} ref={messagesAreaRef}>
      <div className={cn('indicator')} ref={topIndicatorRef}></div>
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
