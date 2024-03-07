import { cn as bem } from '@bem-react/classname';
import { Check as CheckIcon } from 'react-feather';

import { formatDateToHoursAndMinutes } from '../../utils/formatDateToHoursAndMinutes';

import type { IMessage } from '@src/hooks/use-chat';

import './style.css';

type Props = {
  message: IMessage;
  isOwnMessage: boolean;
  isMessageDelivered: boolean;
};

const ChatMessage = ({ message, isOwnMessage, isMessageDelivered }: Props) => {
  const cn = bem('ChatMessage');

  return (
    <li
      key={message._id}
      className={cn()}
    >
      {!isOwnMessage && (
        <div style={{ float: 'left', marginRight: '12px' }}>
          {message.author.profile.avatar.url ? (
            <img
              src={message.author.profile.avatar.url}
              alt={message.author.profile.name}
              className={cn('avatar')}
            />
          ) : (
            <div className={cn('avatarFallback')}>{message.author.profile.name[0]}</div>
          )}
        </div>
      )}

      <div
        style={{
          marginLeft: isOwnMessage ? 'auto' : '0px',
          backgroundColor: isOwnMessage ? '#006dca' : '#323232',
        }}
        className={cn('content')}
      >
        {!isOwnMessage && <div className={cn('username')}>{message.author.profile.name}</div>}
        <div>{message.text}</div>
        <div className={cn('metadata')}>
          <span>{formatDateToHoursAndMinutes(message)}</span>
          {isMessageDelivered && (
            <CheckIcon style={{ color: '#bfbfbf', width: '20px', height: '20px' }} />
          )}
        </div>
      </div>
    </li>
  );
};

export default ChatMessage;
