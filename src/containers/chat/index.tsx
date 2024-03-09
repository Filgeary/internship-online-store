import { useEffect } from 'react';

import ChatInput from '@src/components/chat-input';
import ChatLayout from '@src/components/chat-layout';
import ChatList from '@src/components/chat-list';
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
    isInitialFetching,
    isLoading,
    messages,
    uniqueUUIDs,
    error,
    sendMessage,
    loadLastMessages,
    loadOldMessagesFromID,
    clearAllMessages,
  } = useChat(token);
  const lastMessagesID = messages.at(0)?._id || '';

  // Load last messages on auth
  useEffect(() => {
    if (isAuth) {
      loadLastMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  const handleScrollTop = () => {
    if (!isAuth || isInitialFetching || isLoading) return;
    loadOldMessagesFromID(lastMessagesID);
  };

  return (
    <ChatLayout>
      <ChatList
        isInitialFetching={isInitialFetching}
        messages={messages}
        uniqueUUIDs={uniqueUUIDs}
        user={user}
        onScrollTop={handleScrollTop}
      />

      <div style={{ marginTop: 'auto' }}>
        <ChatInput
          onSubmit={sendMessage}
          error={error}
        />

        <SideLayout side='center'>
          <button onClick={() => loadOldMessagesFromID(lastMessagesID)}>
            Load Prev Messages from last ID
          </button>
          <button onClick={() => loadLastMessages()}>Load Last Messages</button>
          <button onClick={clearAllMessages}>Clear All Messages</button>
        </SideLayout>
      </div>
    </ChatLayout>
  );
};

export default Chat;
