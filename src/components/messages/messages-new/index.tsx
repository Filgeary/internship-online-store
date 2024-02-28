import './style.css';

import React, { memo, useRef, useState } from 'react';

import { cn as bem } from '@bem-react/classname';

type MessagesNewProps = {
  onSubmit: (data: string) => any;
  minLength?: number;
};

function MessagesNew(props: MessagesNewProps) {
  const { minLength = 10 } = props;

  const cn = bem('MessagesNew');
  const [message, setMessage] = useState('');

  const formRef = useRef<HTMLFormElement>();

  const callbacks = {
    sendMessage: (message: string) => {
      if (!options.isSubmitDisabled) {
        setMessage('');
        props.onSubmit(message);
      }
    },
  };

  const handlers = {
    submit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      callbacks.sendMessage(message);
    },

    keyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.code === 'Enter') {
        e.preventDefault();

        if (e.ctrlKey || e.shiftKey) {
          setMessage(message + '\n');
          return;
        }

        callbacks.sendMessage(message);
      }
    },

    change: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
  };

  const options = {
    isSubmitDisabled: message.length < minLength,
  };

  return (
    <div className={cn()}>
      <form ref={formRef} onSubmit={handlers.submit} className={cn('form')}>
        <textarea
          value={message}
          onKeyDown={handlers.keyDown}
          onChange={handlers.change}
          name='text'
          className={cn('input')}
        />
        <button disabled={options.isSubmitDisabled} className={cn('btn-submit')}>
          Отправить
        </button>
      </form>
    </div>
  );
}

export default memo(MessagesNew);
