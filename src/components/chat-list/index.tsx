import { cn as bem } from '@bem-react/classname';
import { useLayoutEffect, useRef } from 'react';

import ChatMessage from '@src/components/chat-message';

import type { IMessage } from '@src/hooks/use-chat';
import type { IUserSession } from '@src/types/IUserSession';

import './style.css';

type Props = {
  messages: IMessage[];
  user: IUserSession['user'] | null;
  uniqueUUIDs: string[] | null;
};

const ChatList = ({ messages, user, uniqueUUIDs }: Props) => {
  const cn = bem('ChatList');
  const messagesUListRef = useRef<HTMLUListElement>(null);
  // Scroll to bottom on new message
  useLayoutEffect(() => {
    if (messagesUListRef.current) {
      messagesUListRef.current.scrollTo({
        top: messagesUListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <ul
      ref={messagesUListRef}
      className={cn()}
    >
      {messages.map(message => {
        const isOwnMessage = message.author.username === user?.username;
        const isMessageDelivered = uniqueUUIDs?.includes(message._key);

        return (
          <ChatMessage
            key={message._id}
            message={message}
            isOwnMessage={isOwnMessage}
            isMessageDelivered={Boolean(isMessageDelivered)}
          />
        );
      })}
    </ul>
  );
};

export default ChatList;
