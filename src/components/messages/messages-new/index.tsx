import './style.css';

import React, { memo, useState } from 'react';

import { cn as bem } from '@bem-react/classname';

type MessagesNewProps = {
  onSubmit: (data: string) => any;
};

function MessagesNew(props: MessagesNewProps) {
  const cn = bem('MessagesNew');
  const [message, setMessage] = useState('');

  const handlers = {
    submit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      props.onSubmit(message);
    },

    change: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
  };

  const options = {
    isSubmitDisabled: message.length < 10,
  };

  return (
    <div className={cn()}>
      <form onSubmit={handlers.submit} className={cn('form')}>
        <textarea value={message} onChange={handlers.change} name='text' className={cn('input')} />
        <button disabled={options.isSubmitDisabled} className={cn('btn-submit')}>
          Отправить
        </button>
      </form>
    </div>
  );
}

export default memo(MessagesNew);
