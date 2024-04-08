import { cn as bem } from '@bem-react/classname';
import { useCallback } from 'react';

import ChatInput from '@src/components/chat-input';
import ChatList from '@src/components/chat-list';
import GithubUserProfile from '../github-user-profile';

import type { IMessage } from '@src/hooks/use-chat';
import type { IUserSession } from '@src/types/IUserSession';
import type { IGithubUser } from '../../types';

import './style.css';

type Props = {
  user: IUserSession['user'] | null;
  messages: IMessage[];
  uniqueUUIDs: string[] | null;
  isInitialFetching: boolean;
  sendMessage: (message: string) => void;
  error?: string;
};

const WorkerChatBot = ({
  user,
  messages,
  uniqueUUIDs,
  isInitialFetching,
  sendMessage,
  error,
}: Props) => {
  const cn = bem('WorkerChatBot');

  const renderGithubUserProfile = useCallback(
    (githubUserAsString: string) => (
      <GithubUserProfile user={JSON.parse(githubUserAsString) as IGithubUser} />
    ),
    [],
  );

  return (
    <section className={cn()}>
      <h1 className={cn('title')}>✨ Chatty Bolt</h1>

      <ChatList
        isInitialFetching={isInitialFetching}
        messages={messages}
        uniqueUUIDs={uniqueUUIDs}
        user={user}
        onScrollTop={() => {}}
        styles={{
          maxHeight: '70vh',
        }}
        renderMessageText={renderGithubUserProfile}
      />

      <div>
        <ChatInput
          onSubmit={sendMessage}
          error={error}
        />
      </div>
    </section>
  );
};

export default WorkerChatBot;
