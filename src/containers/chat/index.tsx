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

  return (
    <ChatLayout>
      <ChatList
        messages={messages}
        uniqueUUIDs={uniqueUUIDs}
        user={user}
      />

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
          <button onClick={clearAllMessages}>Clear All Messages</button>
        </SideLayout>
      </div>
    </ChatLayout>
  );
};

export default Chat;
