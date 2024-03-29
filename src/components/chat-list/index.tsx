import { cn as bem } from '@bem-react/classname';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownCircle as ArrowDownCircleIcon } from 'react-feather';
import { useInView } from 'react-intersection-observer';

import ChatMessage from '@src/components/chat-message';
import { useScroll } from '@src/hooks/use-scroll';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

import type { IMessage } from '@src/hooks/use-chat';
import type { IUserSession } from '@src/types/IUserSession';

import './style.css';

type Props = {
  isInitialFetching: boolean;
  messages: IMessage[];
  user: IUserSession['user'] | null;
  uniqueUUIDs: string[] | null;
  onScrollTop: () => void;
};

const ChatList = ({ isInitialFetching, messages, user, uniqueUUIDs, onScrollTop }: Props) => {
  const cn = bem('ChatList');
  const [isLoadingOnScrollTop, setIsLoadingOnScrollTop] = useState(false);
  const divBottomRef = useRef<HTMLDivElement>(null);
  const messagesUListRef = useRef<HTMLUListElement>(null);
  const { isScrolling, prevScrollHeight } = useScroll({
    ref: messagesUListRef,
  });
  const isMessageListScrolled = !isInitialFetching ? isScrolling : false;

  const scrollToBottom = (forceScroll = false) => {
    if (!divBottomRef.current) return;

    if (forceScroll || !isMessageListScrolled) {
      divBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // restore scroll position on load previous messages
  useIsomorphicLayoutEffect(() => {
    if (
      messagesUListRef.current &&
      prevScrollHeight &&
      !isInitialFetching &&
      isLoadingOnScrollTop
    ) {
      messagesUListRef.current.scrollTop = messagesUListRef.current.scrollHeight - prevScrollHeight;
      setIsLoadingOnScrollTop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // observe scroll on top to load old messages
  const { ref: divTopRef } = useInView({
    onChange: inView => {
      if (inView) {
        onScrollTop();
        if (!isInitialFetching) {
          setIsLoadingOnScrollTop(true);
        }
      }
    },
  });

  return (
    <>
      {<div className={cn('loader', { isLoading: isLoadingOnScrollTop })}>Загрузка...</div>}
      <ul
        ref={messagesUListRef}
        className={cn()}
      >
        <div ref={divTopRef} />
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
        <div ref={divBottomRef} />
      </ul>

      <button
        className={cn('icon', { isScrolling })}
        onClick={() => scrollToBottom(true)}
        title='To bottom ⬇️'
      >
        <ArrowDownCircleIcon
          size={40}
          color='#eee'
        />
      </button>
    </>
  );
};

export default ChatList;
