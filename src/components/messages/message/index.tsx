import './style.css';
import { cn as bem } from '@bem-react/classname';
import { TMessage } from '@src/chat/types';
import dateFormat from '@src/utils/date-format';

type MessageProps = {
  message: TMessage;
  me: boolean;
  sended?: boolean;
  viewed?: boolean;
};

function Message(props: MessageProps) {
  const { message, me, sended = false, viewed = false } = props;

  const cn = bem('Message');

  const options = {
    title: (() => {
      if (sended) return 'Отправлено';
      if (viewed) return 'Получено';
    })(),
  };

  return (
    <article className={cn({ me, sended, viewed })} title={options.title}>
      <div className={cn('header')}>
        <h4 className={cn('username')}>{message.author.profile.name}</h4>
        <span className={cn('date')}>{dateFormat(new Date(message.dateCreate))}</span>
      </div>

      <div className={cn('content')}>
        <p className={cn('text')}>{message.text}</p>
      </div>
    </article>
  );
}

export default Message;
