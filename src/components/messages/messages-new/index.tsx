import './style.css';

import React, { memo } from 'react';

import { cn as bem } from '@bem-react/classname';

type MessagesNewProps = {
  onSubmit: (data: string) => any;
};

function MessagesNew(props: MessagesNewProps) {
  const cn = bem('MessagesNew');

  const handlers = {
    submit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data = new FormData(e.target as HTMLFormElement);
      props.onSubmit(data.get('text') as string);
    },
  };

  return (
    <div className={cn()}>
      <form onSubmit={handlers.submit} className={cn('form')}>
        <textarea name='text' className={cn('input')} />
        <button className={cn('btn-submit')}>Отправить</button>
      </form>
    </div>
  );
}

export default memo(MessagesNew);
