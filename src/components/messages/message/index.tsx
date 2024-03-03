import './style.css';

import { cn as bem } from '@bem-react/classname';

import dateFormat from '@src/utils/date-format';
import { TMessage } from '@src/chat/types';
import SanitizeHtml from '@src/components/sanitize-html';

type MessageProps = {
  message: TMessage;
  me: boolean;
  sended?: boolean;
  exists?: boolean;
};

function Message(props: MessageProps) {
  const { message, me, sended = false, exists = false } = props;

  const cn = bem('Message');

  const options = {
    title: (() => {
      if (sended) return 'Отправлено';
      if (exists) return 'Получено';
    })(),
    avatar: message.author.profile.avatar.url || 'https://loremflickr.com/100/100',
  };

  return (
    <article className={cn({ me, sended, exists })} title={options.title}>
      <div className={cn('header')}>
        <img className={cn('avatar')} src={options.avatar} alt={options.title} />
        <h4 className={cn('username')}>{message.author.profile.name}</h4>
        <span className={cn('date')}>{dateFormat(new Date(message.dateCreate))}</span>
      </div>

      <div className={cn('content')}>
        <SanitizeHtml
          className={cn('text')}
          as={'div'}
          html={message.text.replace(/\s\s+/gi, ' ')}
        />
      </div>
    </article>
  );
}

export default Message;
