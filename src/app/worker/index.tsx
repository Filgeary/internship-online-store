import { memo, useEffect, useState } from 'react';
import type { PartialDeep } from 'type-fest';

import useInit from '@src/hooks/use-init';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import WorkerChatBot from './components/worker-chat-bot';

import type { IMessage } from '@src/hooks/use-chat';
import type { IUserSession } from '@src/types/IUserSession';

const uuid = () => self.crypto.randomUUID();
const authorID = uuid();

const preconfiguredAdminUser: PartialDeep<IUserSession['user']> = {
  _id: authorID,
  username: 'admin',
  profile: {
    name: 'Admin',
    avatar: {
      _id: authorID,
    },
  },
};

function Worker() {
  const store = useStore();
  const [messages, setMessages] = useState<PartialDeep<IMessage>[]>([]);
  const [uniqueUUIDs, setUniqueUUIDs] = useState<string[]>([]);

  useInit(async () => {
    await store.actions.worker.init();
  }, []);

  useEffect(() => {
    return () => {
      store.actions.worker.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = useSelector(state => ({
    message: state.worker.message,
  }));

  useEffect(() => {
    if (select.message) {
      setMessages(prev => [...prev, select.message]);
    }
  }, [select.message]);

  const handlePostMessage = (text: string) => {
    store.actions.worker.postMessage(text);
    const commentID = uuid();
    setUniqueUUIDs(prevUUIDs => [...(prevUUIDs || []), commentID]);
    setMessages(prev => [
      ...prev,
      {
        _id: commentID,
        dateCreate: new Date().toISOString(),
        text,
        author: {
          _id: authorID,
          username: 'admin',
          profile: { name: 'Admin', avatar: {} },
        },
      },
    ]);
  };

  const notEmptyMessages = messages.filter(m => Object.keys(m).length > 0);

  return (
    <WorkerChatBot
      user={preconfiguredAdminUser as IUserSession['user']}
      messages={notEmptyMessages as IMessage[]}
      uniqueUUIDs={uniqueUUIDs}
      isInitialFetching={true}
      sendMessage={handlePostMessage}
    />
  );
}

export default memo(Worker);
