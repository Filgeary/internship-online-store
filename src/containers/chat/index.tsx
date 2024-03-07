import { useEffect, useLayoutEffect, useRef } from 'react';

import ChatInput from '@src/components/chat-input';
import ChatMessage from '@src/components/chat-message';
import SideLayout from '@src/components/side-layout';
import { useChat } from '@src/hooks/use-chat';

import type { IUserSession } from '@src/types/IUserSession';

type Props = {
  token: string;
  user: IUserSession['user'] | null;
};

const Chat = ({ token, user }: Props) => {
  const {
    isAuth,
    messages,
    uniqueUUIDs,
    error,
    sendMessage,
    loadLastMessages,
    loadOldMessagesFromID,
    clearAllMessages,
  } = useChat(token);

  const lastMessagesID = messages.at(0)?._id || '';

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

  // Load last messages on auth
  useEffect(() => {
    if (isAuth) {
      loadLastMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  const handleClearAllMessages = () => {
    clearAllMessages();
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'grid',
        gap: '16px',
        padding: '60px 20px',
        placeItems: 'center',
        margin: '0 auto',
        minHeight: '80vh',
        color: 'white',
        background: '#232222',
      }}
    >
      <ul
        ref={messagesUListRef}
        style={{
          listStyle: 'none',
          wordBreak: 'break-word',
          padding: '12px 32px',
          margin: 0,
          maxHeight: '500px',
          overflow: 'auto',
          width: '100%',
        }}
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

      <div style={{ marginTop: 'auto' }}>
        <ChatInput
          onSubmit={sendMessage}
          error={error}
        />

        <SideLayout side='center'>
          <button onClick={() => loadOldMessagesFromID(lastMessagesID)}>
            Load Old Messages from ID
          </button>
          <button onClick={() => loadLastMessages()}>Load Last Messages</button>
          <button onClick={handleClearAllMessages}>Clear All Messages</button>
        </SideLayout>
      </div>
    </div>
  );
};

export default Chat;
