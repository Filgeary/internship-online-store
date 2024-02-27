import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Field from '@src/components/field';
import { useChat } from '@src/hooks/use-chat';
import { IUserSession } from '@src/types/IUserSession';
import { Check } from 'react-feather';

type Props = {
  token: string;
  user: IUserSession['user'] | null;
};

const Chat = ({ token, user }: Props) => {
  const { isAuth, messages, uniqueUUIDs, error, sendMessage, loadLastMessages, clearAllMessages } =
    useChat(token);
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const messagesUListRef = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    if (messagesUListRef.current) {
      messagesUListRef.current.scrollTo({
        top: messagesUListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (isAuth) {
      loadLastMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  const handleSendMessage = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleClearAllMessages = () => {
    clearAllMessages();
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'grid',
        gap: '16px',
        padding: '60px 20px',
        placeItems: 'center',
        margin: '0 auto',
        minHeight: '80vh',
        color: 'white',
        background: '#232222',
      }}
    >
      <ul
        ref={messagesUListRef}
        style={{
          listStyle: 'none',
          padding: '12px 32px',
          margin: 0,
          maxHeight: '500px',
          overflow: 'auto',
          width: '100%',
        }}
      >
        {messages.map(message => (
          <li
            key={message._id}
            style={{
              marginLeft: `${message.author.username === user?.username ? 'auto' : '0'}`,
              color: message.author.username === user?.username ? '#00ff7f' : 'white',
              display: 'flex',
              placeItems: 'center',
              gap: '12px',
              width: 'max-content',
              maxWidth: '60%',
              padding: '10px 20px',
              marginBottom: '10px',
              border: '4px solid #ccc',
              borderRadius: '20px',
            }}
          >
            {message.text}{' '}
            {uniqueUUIDs?.includes(message._key) && <Check style={{ color: 'white' }} />}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto' }}>
        <form onSubmit={handleSendMessage}>
          <Field>
            <input
              ref={inputRef}
              name='chat-message'
              placeholder='Enter message'
              value={inputValue}
              onChange={evt => setInputValue(evt.target.value)}
              style={{
                outline: 'none',
                background: '#eee',
                border: '4px solid dodgerblue',
                borderRadius: '16px',
                height: '50px',
                lineHeight: 'normal',
                color: '#282828',
                display: 'block',
                width: '600px',
                boxSizing: 'border-box',
                userSelect: 'auto',
                fontSize: '16px',
                padding: '0 6px',
                paddingLeft: '12px',
              }}
            />
          </Field>
          <Field error={error} />
        </form>

        <div style={{ display: 'flex', gap: '16px', placeItems: 'center', placeContent: 'center' }}>
          <button onClick={() => loadLastMessages()}>Load Last Messages</button>
          <button onClick={handleClearAllMessages}>Clear All Messages</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
