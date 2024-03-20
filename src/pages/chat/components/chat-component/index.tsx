import React, {ChangeEvent, memo, useRef, useState} from 'react';
import './style.css';
import ArrowSVG from './images/arrow.svg?react';
import {cn as bem} from "@bem-react/classname";
import ChatList from "@src/pages/chat/components/chat-list";

function ChatComponent({list, username, sendMessage, uploadOldMessages}: {
  list: Message[],
  username: string,
  sendMessage: (text: string) => void,
  uploadOldMessages: () => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef(document.createElement('textarea'))

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
  }

  const onInput = () => {
    if(inputRef.current.offsetHeight === inputRef.current.scrollHeight) inputRef.current.style.height = 'auto'
    if(inputRef.current.offsetHeight < inputRef.current.scrollHeight && inputRef.current.scrollHeight < 150) {
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }

  function onSendMessage() {
    if (value) {
      sendMessage(value)
      setValue('')
    }
  }

  const cn = bem('ChatComponent');
  return (
    <div className={cn()}>
      <ChatList list={list} username={username} uploadOldMessages={uploadOldMessages}/>
      <div className={cn('InputContainer')}>
        <textarea className={cn('Input')} value={value} onChange={onChange}
                  onInput={onInput} ref={inputRef}/>
        <div className={cn('InputContainer-arrow') + (value ? ' visible' : '')}
             onClick={onSendMessage}>
          <ArrowSVG/>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatComponent);
