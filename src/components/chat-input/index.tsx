import { cn as bem } from '@bem-react/classname';
import { useEffect, useRef, useState } from 'react';

import Field from '@src/components/field';

import './style.css';

type Props = {
  onSubmit: (value: string) => void;
  error: string | undefined;
};

const ChatInput = ({ onSubmit, error }: Props) => {
  const cn = bem('ChatInput');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Initial focus on input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formattedValue = inputValue.trim();
    if (formattedValue.length === 0) return;

    onSubmit(formattedValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <input
          ref={inputRef}
          name='input-chat'
          placeholder='Write a message...'
          value={inputValue}
          onChange={evt => setInputValue(evt.target.value)}
          className={cn('input')}
        />
      </Field>
      <Field error={error} />
    </form>
  );
};

export default ChatInput;
