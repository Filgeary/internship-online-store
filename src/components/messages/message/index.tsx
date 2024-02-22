import './style.css';
import { cn as bem } from '@bem-react/classname';

// type MessageProps =
//   | {
//       me: true;
//       sended: boolean;
//       viewed: boolean;
//     }
//   | { me: boolean; sended?: boolean; viewed?: boolean };

type MessageProps = {
  me: boolean;
  sended?: boolean;
  viewed?: boolean;
};

function Message(props: MessageProps) {
  const { me, sended = false, viewed = false } = props;

  const cn = bem('Message');

  return (
    <article className={cn({ me, sended, viewed })}>
      <div className={cn('header')}>
        <h4 className={cn('username')}>Иван Иванов</h4>
        <span className={cn('date')}>Сегодня в 14:04</span>
      </div>

      <div className={cn('content')}>
        <p className={cn('text')}>
          Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Все,
          города агентство? Которое использовало себя толку рыбными злых рот.
        </p>
      </div>
    </article>
  );
}

export default Message;
